import { AddEffectFn } from '@/store/store';
import {
  deleteExercise,
  deleteStoredSession,
  initializeStoredSessionsStateSlice,
  putStoredSession,
  restoreExercise,
  selectSession,
  sessionFinished,
  setActiveSessionId,
  setBuiltInExercises,
  setExercises,
  setHiddenBuiltInIds,
  setIsHydrated,
  setStoredSessions,
  updateExercise,
  updateStoredSession,
  upsertExercises,
  upsertStoredSessions,
} from './index';
import { fetchUpcomingSessions } from '@/store/program';
import { addUnpublishedSessionId } from '@/store/feed';
import { setStatsIsDirty } from '@/store/stats';
import { setPreferredLanguage } from '@/store/settings';
import { Session } from '@/models/session-models';
import { sessionMigrations } from '@/models/storage/versions/migrations';
import { exercisesSchema, sessionsSchema } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { toRecord } from '@/utils/reduce';
import { fromExerciseDescriptorJSON, toExerciseDescriptorJSON } from '@/models/exercise-models';
import { loadBuiltInExercises } from '@/services/exercise-catalog';
import { migrateLegacyCurrentSession } from '@/store/stored-sessions/legacy-current-session';
import { atomicWrites } from '@/db/atomic-writes';

// Built-ins the user deleted, so they stay hidden across restarts and locale switches.
const hiddenBuiltInExerciseIdsStorageKey = 'HiddenBuiltInExerciseIdList';
export function applyStoredSessionsEffects(addEffect: AddEffectFn) {
  // Dispatched AFTER settings, so we can safely access settings
  addEffect(
    initializeStoredSessionsStateSlice,
    async (_, { cancelActiveListeners, getState, dispatch, extra: { keyValueStore, db, logger } }) => {
      cancelActiveListeners();
      if (!getState().settings.isHydrated) {
        throw new Error('Settings must be hydrated before stored sessions');
      }
      await logger.time('initializeStoredSessions', async () => {
        const rows = await db.select().from(sessionsSchema);
        const storedSessions = rows.reduce(
          toRecord(
            (x) => x.id,
            (row) => Session.fromJSON(sessionMigrations.migrate(row.payload)),
          ),
          {},
        );
        dispatch(setStoredSessions(storedSessions));
        // Only when there is one: dispatching `undefined` would clear every flag in the table, and a
        // kill between that write and the migration below would lose the workout in progress.
        const activeRowId = rows.find((x) => x.active)?.id;
        if (activeRowId) {
          dispatch(setActiveSessionId(activeRowId));
        }
      });

      await migrateLegacyCurrentSession(dispatch, getState, keyValueStore, logger);

      const savedExercises = (await db.select().from(exercisesSchema)).reduce(
        toRecord(
          (x) => x.id,
          (x) => fromExerciseDescriptorJSON(x.payload),
        ),
        {},
      );
      dispatch(setExercises(savedExercises));

      const builtInExercises = await loadBuiltInExercises(getState().settings.preferredLanguage);
      dispatch(setBuiltInExercises(builtInExercises));

      const hiddenBuiltInIds = JSON.parse(
        (await keyValueStore.getItem(hiddenBuiltInExerciseIdsStorageKey)) ?? '[]',
      ) as string[];
      dispatch(setHiddenBuiltInIds(hiddenBuiltInIds));

      dispatch(setIsHydrated(true));
      dispatch(fetchUpcomingSessions());
    },
  );

  // Re-resolve the built-in catalog when the language changes (startup load is handled above).
  addEffect(setPreferredLanguage, async (action, { getState, dispatch }) => {
    if (!getState().storedSessions.isHydrated) {
      return;
    }
    dispatch(setBuiltInExercises(await loadBuiltInExercises(action.payload)));
  });

  // Completion, not content: a session is only exported and queued for the feed once the user is done
  // with it, otherwise every recorded set would fire a health export.
  addEffect(sessionFinished, async (action, { getState, dispatch, extra: { healthExportService, logger } }) => {
    const state = getState();
    const workout = selectSession(state, action.payload);
    if (!workout) {
      return;
    }

    if (state.storedSessions.activeSessionId === workout.id) {
      dispatch(setActiveSessionId(undefined));
    }
    dispatch(addUnpublishedSessionId(workout.id));
    dispatch(setStatsIsDirty(true));
    dispatch(fetchUpcomingSessions());

    if (!state.settings.exportToHealthAggregator || !healthExportService.canExport()) {
      return;
    }
    try {
      await healthExportService.exportWorkout(workout);
    } catch (e) {
      logger.error('Failed to sync to health aggregator', e);
    }
  });

  addEffect(deleteStoredSession, async (action, { getState, extra: { logger, db, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      if (selectSession(getState(), action.payload)) return;
      await logger.time('deleteStoredSession', async () => {
        await db.delete(sessionsSchema).where(eq(sessionsSchema.id, action.payload));
      });
    });
  });
  addEffect(deleteStoredSession, async (action, { stateAfterReduce, extra: { healthExportService, logger } }) => {
    const workoutId = action.payload;
    if (!stateAfterReduce.settings.exportToHealthAggregator || !healthExportService.canExport()) {
      return;
    }
    try {
      await healthExportService.deleteWorkout(workoutId);
    } catch (e) {
      logger.error('Failed to delete workout from HealthConnect', e);
    }
  });

  // Content only. The `active` flag has a single writer below, so a recorded set never touches it.
  addEffect(
    [putStoredSession, updateStoredSession],
    async (action, { getState, extra: { db, logger, trainingDataQueue } }) => {
      const sessionId = putStoredSession.match(action)
        ? action.payload.id
        : updateStoredSession.match(action)
          ? action.payload.sessionId
          : undefined;
      await trainingDataQueue.run(async () => {
        // Read after preceding sync imports and local writes have finished, not when queued.
        const session = sessionId === undefined ? undefined : selectSession(getState(), sessionId);
        if (!session) return;
        await logger.time('persistStoredSession', async () => {
          await db
            .insert(sessionsSchema)
            .values({
              id: session.id,
              active: false,
              payload: session.toJSON(),
            })
            .onConflictDoUpdate({
              target: sessionsSchema.id,
              set: {
                payload: sql.raw(`excluded.${sessionsSchema.payload.name}`),
              },
            });
        });
      });
    },
  );

  // The only writer of `active`. It upserts rather than updates so it does not depend on the row having
  // been written by the effect above first - the two are dispatched together and race.
  addEffect(setActiveSessionId, async (_, { getState, extra: { db, logger, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      const state = getState();
      const sessionId = state.storedSessions.activeSessionId;
      const session = sessionId === undefined ? undefined : selectSession(state, sessionId);
      await logger.time('setActiveSessionId', async () => {
        await atomicWrites(db, (tx) => [
          () => tx.update(sessionsSchema).set({ active: false }).where(eq(sessionsSchema.active, true)).run(),
          () =>
            session
              ? tx
                  .insert(sessionsSchema)
                  .values({ id: session.id, active: true, payload: session.toJSON() })
                  .onConflictDoUpdate({ target: sessionsSchema.id, set: { active: true } })
                  .run()
              : undefined,
        ]);
      });
    });
  });

  addEffect(upsertStoredSessions, async (action, { getState, extra: { db, logger, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      // Restored sessions are never active - a backup should not resume someone else's workout, and an
      // in-progress workout on this device keeps its flag because the conflict path only sets payload.
      const state = getState();
      const toUpsert = action.payload.flatMap((item) => {
        const session = selectSession(state, item.id);
        return session
          ? [
              {
                id: session.id,
                active: false,
                payload: session.toJSON(),
              },
            ]
          : [];
      });
      if (!toUpsert.length) return;
      await logger.time('upsertStoredSessions', async () => {
        await db
          .insert(sessionsSchema)
          .values(toUpsert)
          .onConflictDoUpdate({
            target: sessionsSchema.id,
            set: {
              payload: sql.raw(`excluded.${sessionsSchema.payload.name}`),
            },
          });
      });
    });
  });

  addEffect(deleteExercise, async (action, { getState, extra: { db, keyValueStore, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      const state = getState();
      if (state.storedSessions.builtInExercises[action.payload]) {
        // Built-ins are tombstoned rather than removed; their override row (if any) is kept for undo.
        await keyValueStore.setItem(
          hiddenBuiltInExerciseIdsStorageKey,
          JSON.stringify(state.storedSessions.hiddenBuiltInIds),
        );
      } else if (!state.storedSessions.savedExercises[action.payload]) {
        await db.delete(exercisesSchema).where(eq(exercisesSchema.id, action.payload));
      }
    });
  });

  addEffect(restoreExercise, async (_, { getState, extra: { keyValueStore, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () =>
      keyValueStore.setItem(
        hiddenBuiltInExerciseIdsStorageKey,
        JSON.stringify(getState().storedSessions.hiddenBuiltInIds),
      ),
    );
  });

  addEffect(updateExercise, async (action, { getState, extra: { db, keyValueStore, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      const state = getState();
      const exercise = state.storedSessions.savedExercises[action.payload.id];
      if (!exercise) return;
      await db
        .insert(exercisesSchema)
        .values({
          id: action.payload.id,
          payload: toExerciseDescriptorJSON(exercise),
        })
        .onConflictDoUpdate({
          target: exercisesSchema.id,
          set: {
            payload: sql.raw(`excluded.${exercisesSchema.payload.name}`),
          },
        });
      await keyValueStore.setItem(
        hiddenBuiltInExerciseIdsStorageKey,
        JSON.stringify(getState().storedSessions.hiddenBuiltInIds),
      );
    });
  });

  addEffect(upsertExercises, async (action, { getState, extra: { db, keyValueStore, trainingDataQueue } }) => {
    await trainingDataQueue.run(async () => {
      const state = getState();
      const exercises = Object.keys(action.payload).flatMap((id) => {
        const exercise = state.storedSessions.savedExercises[id];
        return exercise
          ? [
              {
                id,
                payload: toExerciseDescriptorJSON(exercise),
              },
            ]
          : [];
      });
      if (!exercises.length) {
        return;
      }
      await db
        .insert(exercisesSchema)
        .values(exercises)
        .onConflictDoUpdate({
          target: exercisesSchema.id,
          set: {
            payload: sql.raw(`excluded.${exercisesSchema.payload.name}`),
          },
        });
      await keyValueStore.setItem(
        hiddenBuiltInExerciseIdsStorageKey,
        JSON.stringify(getState().storedSessions.hiddenBuiltInIds),
      );
    });
  });

  addEffect(setExercises, async (_, { stateAfterReduce, getState, extra: { db, trainingDataQueue } }) => {
    if (!stateAfterReduce.storedSessions.isHydrated) {
      return;
    }
    await trainingDataQueue.run(async () => {
      const exercises = Object.entries(getState().storedSessions.savedExercises).map(([id, exercise]) => ({
        id,
        payload: toExerciseDescriptorJSON(exercise),
      }));
      await atomicWrites(db, (tx) => [
        () => tx.delete(exercisesSchema).run(),
        () => (exercises.length ? tx.insert(exercisesSchema).values(exercises).run() : undefined),
      ]);
    });
  });
}
