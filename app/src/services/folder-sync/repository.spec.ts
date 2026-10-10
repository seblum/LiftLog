import { beforeEach, describe, expect, it, vi } from 'vitest';
import { configureStore, type Middleware, type Store, type UnknownAction } from '@reduxjs/toolkit';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { openDatabaseAsync } from 'expo-sqlite';
import { eq, sql } from 'drizzle-orm';
import { LocalDate, OffsetDateTime } from '@js-joda/core';
import { sessionsSchema, programsSchema, folderSyncBaselinesSchema } from '@/db/schema';
import { DatabaseMigrationService } from '@/services/database-migration-service';
import { AppFolderSyncRepository } from '@/services/folder-sync/repository';
import { TrainingDataQueue } from '@/services/training-data-queue';
import { KeyValueStore } from '@/services/key-value-store';
import { Session, RecordedWeightedExercise } from '@/models/session-models';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { Weight } from '@/models/weight';
import { makeRecordedExercise, makeSession, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import {
  makeSyncTombstone,
  normalizeSyncRecord,
  syncRecordFilename,
  syncRecordsEqual,
  type SyncRecord,
} from '@/models/folder-sync';
import programReducer, {
  fetchUpcomingSessions,
  savePlan,
  setActivePlan,
  setIsHydrated as hydratePrograms,
} from '@/store/program';
import {
  storedSessionsReducer,
  putStoredSession,
  setActiveSessionId,
  setIsHydrated as hydrateSessions,
  setHiddenBuiltInIds,
} from '@/store/stored-sessions';
import { settingsReducer, setFolderSyncUri, setIsHydrated as hydrateSettings } from '@/store/settings';
import { statsReducer, setStatsIsDirty, fetchOverallStats } from '@/store/stats';
import type { RootState } from '@/store/store';
import { applyFolderSyncRecord } from '@/store/folder-sync-actions';

const folder = 'content://test-folder';

function recordFor(session: Session): SyncRecord {
  return normalizeSyncRecord({ version: 1, kind: 'session', id: session.id, deleted: false, data: session.toJSON() });
}

function setup(db: ExpoSQLiteDatabase) {
  const dispatched: UnknownAction[] = [];
  const captureActions: Middleware = () => (next) => (action) => {
    dispatched.push(action as UnknownAction);
    return next(action);
  };
  const store = configureStore({
    reducer: {
      program: programReducer,
      storedSessions: storedSessionsReducer,
      settings: settingsReducer,
      stats: statsReducer,
    },
    middleware: (defaults) => defaults({ serializableCheck: false, immutableCheck: false }).concat(captureActions),
  });
  store.dispatch(hydrateSettings(true));
  store.dispatch(hydrateSessions(true));
  store.dispatch(hydratePrograms(true));
  store.dispatch(setFolderSyncUri(folder));
  const keyValueStore = new KeyValueStore();
  const queue = new TrainingDataQueue();
  const repository = new AppFolderSyncRepository(store as unknown as Store<RootState>, db, keyValueStore, queue);
  return { store, repository, queue, keyValueStore, dispatched };
}

describe('AppFolderSyncRepository', () => {
  let db: ExpoSQLiteDatabase;
  beforeEach(async () => {
    db = drizzle(await openDatabaseAsync(':memory:'));
    await new DatabaseMigrationService(db, { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() } as never, {
      importOldData: async () => {},
    }).migrate();
  });

  it('commits imported training data and its folder-specific baseline together', async () => {
    const t = setup(db);
    const workout = Session.freeformSession(LocalDate.of(2026, 9, 30), undefined).withName('Desktop workout');
    const record = recordFor(workout);
    expect(await t.repository.commit(folder, syncRecordFilename(record), record, undefined, true)).toBe(true);
    expect((await db.select().from(sessionsSchema))[0]?.payload).toEqual(record.data);
    expect(syncRecordsEqual((await t.repository.baselines(folder))[syncRecordFilename(record)], record)).toBe(true);
    expect(await t.repository.baselines('different-folder')).toEqual({});
    expect(t.store.getState().storedSessions.sessions[workout.id]?.blueprint.name).toBe('Desktop workout');
    expect(t.dispatched.map((action) => action.type)).toContain(setStatsIsDirty.type);
    expect(t.dispatched.map((action) => action.type)).not.toContain('storedSessions/sessionFinished');
    expect(t.dispatched.some((action) => action.type.includes('UnpublishedSession'))).toBe(false);
  });

  it('rolls back the database payload when the baseline write fails', async () => {
    const t = setup(db);
    const workout = Session.freeformSession(LocalDate.of(2026, 9, 30), undefined).withName('Original');
    const before = recordFor(workout);
    const after = recordFor(workout.withName('Incoming'));
    t.store.dispatch(putStoredSession(workout));
    await db.insert(sessionsSchema).values({ id: workout.id, active: false, payload: workout.toJSON() });
    await Promise.resolve(
      db.run(
        sql`CREATE TRIGGER fail_baseline BEFORE INSERT ON folder_sync_baseline BEGIN SELECT RAISE(ABORT, 'disk failure'); END`,
      ),
    );
    await expect(t.repository.commit(folder, syncRecordFilename(after), after, before, true)).rejects.toThrow();
    const [row] = await db.select().from(sessionsSchema).where(eq(sessionsSchema.id, workout.id));
    expect(row?.payload.blueprint.name).toBe('Original');
    expect(await db.select().from(folderSyncBaselinesSchema)).toEqual([]);
    expect(t.store.getState().storedSessions.sessions[workout.id]?.blueprint.name).toBe('Incoming');
    const actions = t.dispatched.map((action) => action.type);
    expect(actions).toContain(setStatsIsDirty.type);
    expect(actions).toContain(fetchUpcomingSessions.type);
    expect(actions).toContain(fetchOverallStats.type);
  });

  it('checks for newer local edits when the commit reaches the shared persistence queue', async () => {
    const t = setup(db);
    const workout = Session.freeformSession(LocalDate.of(2026, 9, 30), undefined);
    t.store.dispatch(putStoredSession(workout));
    const before = recordFor(workout);
    const incoming = recordFor(workout.withName('Desktop'));
    const { promise: barrier, resolve: release } = Promise.withResolvers<void>();
    const preceding = t.queue.run(() => barrier);
    const commit = t.repository.commit(folder, syncRecordFilename(incoming), incoming, before, true);
    t.store.dispatch(putStoredSession(workout.withName('New phone edit')));
    release();
    await preceding;
    expect(await commit).toBe(false);
    expect(t.store.getState().storedSessions.sessions[workout.id]?.blueprint.name).toBe('New phone edit');
    expect(await t.repository.baselines(folder)).toEqual({});
  });

  it('defers active workouts and refuses writes after disconnecting or before hydration', async () => {
    const t = setup(db);
    const workout = Session.freeformSession(LocalDate.of(2026, 9, 30), undefined);
    t.store.dispatch(putStoredSession(workout));
    t.store.dispatch(setActiveSessionId(workout.id));
    const record = recordFor(workout);
    expect(t.repository.blockReason(record)).toContain('in progress');
    expect(await t.repository.commit(folder, syncRecordFilename(record), record, record, true)).toBe(false);
    t.store.dispatch(setActiveSessionId(undefined));
    t.store.dispatch(setFolderSyncUri(''));
    expect(await t.repository.commit(folder, syncRecordFilename(record), record, record, true)).toBe(false);
    t.store.dispatch(setFolderSyncUri(folder));
    t.store.dispatch(hydrateSessions(false));
    expect(await t.repository.commit(folder, syncRecordFilename(record), record, record, true)).toBe(false);
    expect(await t.repository.baselines(folder)).toEqual({});
  });

  it('selects a remaining plan when a remote tombstone deletes the active plan, and protects the last plan', async () => {
    const t = setup(db);
    for (const id of ['first', 'second']) {
      const program = new ProgramBlueprint(id, [], LocalDate.of(2026, 9, 30));
      t.store.dispatch(savePlan({ programId: id, programBlueprint: program }));
      await db.insert(programsSchema).values({ id, active: id === 'first', payload: program.toJSON() });
    }
    t.store.dispatch(setActivePlan({ activePlanId: 'first' }));
    const local = t.repository.getLocal({ kind: 'program', id: 'first' });
    const deletion = makeSyncTombstone('program', 'first');
    expect(await t.repository.commit(folder, syncRecordFilename(deletion), deletion, local, true)).toBe(true);
    expect(t.store.getState().program.activePlanId).toBe('second');
    expect((await db.select().from(programsSchema)).map((row) => [row.id, row.active])).toEqual([['second', true]]);
    const lastDeletion = makeSyncTombstone('program', 'second');
    expect(t.repository.blockReason(lastDeletion, lastDeletion)).toContain('at least one plan');
    expect(
      await t.repository.commit(
        folder,
        syncRecordFilename(lastDeletion),
        lastDeletion,
        t.repository.getLocal(lastDeletion),
        true,
      ),
    ).toBe(false);
  });

  it('rebuilds progression inputs when an incoming correction keeps the same completion timestamp', async () => {
    const t = setup(db);
    const blueprint = makeWeightedBlueprint({ name: 'Squat' });
    const timestamp = OffsetDateTime.parse('2026-09-30T10:00:00Z');
    const originalExercise = makeRecordedExercise(blueprint, [5, 5, 5], new Weight(100, 'kilograms'), () => timestamp);
    const correctedExercise = makeRecordedExercise(blueprint, [5, 5, 5], new Weight(85, 'kilograms'), () => timestamp);
    const session = makeSession([blueprint]).withExercise(0, originalExercise);
    t.store.dispatch(putStoredSession(session));
    const corrected = session.withExercise(0, correctedExercise).withUpdatedDate(LocalDate.of(2026, 9, 30));
    const record = recordFor(corrected);
    expect(await t.repository.commit(folder, syncRecordFilename(record), record, recordFor(session), true)).toBe(true);
    const state = t.store.getState().storedSessions;
    const latest = state.latestExercises[blueprint.progressionKey()] as RecordedWeightedExercise;
    expect(latest.potentialSets[0]?.weight.value.toNumber()).toBe(85);
    expect(state.earliestSession?.date.toString()).toBe('2026-09-30');
    const deletion = makeSyncTombstone('session', session.id);
    expect(await t.repository.commit(folder, syncRecordFilename(deletion), deletion, record, true)).toBe(true);
    expect(t.store.getState().storedSessions.latestExercises).toEqual({});
    expect(t.store.getState().storedSessions.earliestSession).toBeUndefined();
  });

  it('persists exercise visibility and restores the canonical visible value', async () => {
    const t = setup(db);
    const identity = { kind: 'exercise-visibility' as const, id: '3/4 Sit-Up' };
    const hidden: SyncRecord = { version: 1, ...identity, deleted: false, data: { hidden: true } };
    const visible = t.repository.getLocal(identity);
    expect(visible).toMatchObject({ data: { hidden: false } });
    expect(await t.repository.commit(folder, syncRecordFilename(hidden), hidden, visible, true)).toBe(true);
    expect(await t.keyValueStore.getItem('HiddenBuiltInExerciseIdList')).toBe('["3/4 Sit-Up"]');
    t.store.dispatch(setHiddenBuiltInIds([]));
    expect(t.repository.getLocal(identity)).toEqual(visible);
    expect(await t.repository.commit(folder, syncRecordFilename(hidden), visible!, visible, false)).toBe(true);
    expect(await t.keyValueStore.getItem('HiddenBuiltInExerciseIdList')).toBe('[]');
  });

  it('leaves workout completion effects out of the import action itself', () => {
    const session = Session.freeformSession(LocalDate.of(2026, 9, 30), undefined);
    const t = setup(db);
    t.store.dispatch(applyFolderSyncRecord(recordFor(session)));
    expect(t.dispatched.at(-1)?.type).toBe(applyFolderSyncRecord.type);
  });
});
