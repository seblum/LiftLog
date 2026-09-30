import type { Store } from '@reduxjs/toolkit';
import { eq, sql } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { exercisesSchema, folderSyncBaselinesSchema, programsSchema, sessionsSchema } from '@/db/schema';
import { toExerciseDescriptorJSON } from '@/models/exercise-models';
import {
  normalizeSyncRecord,
  parseSyncRecord,
  syncRecordsEqual,
  type SyncIdentity,
  type SyncRecord,
} from '@/models/folder-sync';
import type { FolderSyncRepository } from '@/services/folder-sync-service';
import type { KeyValueStore } from '@/services/key-value-store';
import type { TrainingDataQueue } from '@/services/training-data-queue';
import type { RootState } from '@/store/store';
import { applyFolderSyncRecord } from '@/store/folder-sync-actions';
import { fetchUpcomingSessions } from '@/store/program';
import { setFolderSyncUri } from '@/store/settings';
import { fetchOverallStats, setStatsIsDirty } from '@/store/stats';
import { atomicWrites } from '@/db/atomic-writes';

const hiddenIdsKey = 'HiddenBuiltInExerciseIdList';

export class AppFolderSyncRepository implements FolderSyncRepository {
  constructor(
    private readonly store: Store<RootState>,
    private readonly db: ExpoSQLiteDatabase,
    private readonly keyValueStore: KeyValueStore,
    private readonly queue: TrainingDataQueue,
  ) {}

  isReady() {
    const state = this.store.getState();
    return state.settings.isHydrated && state.storedSessions.isHydrated && state.program.isHydrated;
  }

  getFolderUri() {
    return this.store.getState().settings.folderSyncUri || undefined;
  }
  setFolderUri(uri: string) {
    this.store.dispatch(setFolderSyncUri(uri));
  }

  listLocal(): SyncRecord[] {
    const state = this.store.getState();
    const identities: SyncIdentity[] = [
      ...Object.keys(state.storedSessions.sessions).map((id) => ({ kind: 'session' as const, id })),
      ...Object.keys(state.program.savedPrograms).map((id) => ({ kind: 'program' as const, id })),
      ...Object.keys(state.storedSessions.savedExercises).map((id) => ({ kind: 'exercise' as const, id })),
      ...state.storedSessions.hiddenBuiltInIds.map((id) => ({ kind: 'exercise-visibility' as const, id })),
    ];
    return identities.flatMap((identity) => {
      const record = this.getLocal(identity);
      return record ? [record] : [];
    });
  }

  getLocal({ kind, id }: SyncIdentity): SyncRecord | undefined {
    const state = this.store.getState();
    switch (kind) {
      case 'session': {
        const session = state.storedSessions.sessions[id];
        return session
          ? normalizeSyncRecord({ version: 1, kind, id, deleted: false, data: session.toJSON() })
          : undefined;
      }
      case 'program': {
        const program = state.program.savedPrograms[id];
        return program ? { version: 1, kind, id, deleted: false, data: program.toJSON() } : undefined;
      }
      case 'exercise': {
        const exercise = state.storedSessions.savedExercises[id];
        return exercise
          ? { version: 1, kind, id, deleted: false, data: toExerciseDescriptorJSON(exercise) }
          : undefined;
      }
      case 'exercise-visibility':
        return {
          version: 1,
          kind,
          id,
          deleted: false,
          data: { hidden: state.storedSessions.hiddenBuiltInIds.includes(id) },
        };
    }
  }

  blockReason(identity: SyncIdentity, incoming?: SyncRecord) {
    const state = this.store.getState();
    if (identity.kind === 'session' && identity.id === state.storedSessions.activeSessionId) {
      return 'This workout is in progress. It will sync after you finish it.';
    }
    if (
      incoming?.kind === 'program' &&
      incoming.deleted &&
      state.program.savedPrograms[incoming.id] &&
      Object.keys(state.program.savedPrograms).length <= 1
    ) {
      return 'Keep at least one plan in LiftLog. Add another plan before deleting this one.';
    }
    return undefined;
  }

  async baselines(uri: string): Promise<Record<string, SyncRecord>> {
    const rows = await this.db
      .select()
      .from(folderSyncBaselinesSchema)
      .where(eq(folderSyncBaselinesSchema.folderUri, uri));
    return Object.fromEntries(
      rows.map((row) => {
        const parsed = parseSyncRecord(JSON.stringify(row.payload));
        if (!parsed.ok) throw new Error(`The local sync state for ${row.path} cannot be read: ${parsed.error}`);
        return [row.path, parsed.record];
      }),
    );
  }

  commit(
    uri: string,
    path: string,
    record: SyncRecord,
    expectedLocal: SyncRecord | undefined,
    apply: boolean,
  ): Promise<boolean> {
    return this.queue.run(async () => {
      if (
        this.getFolderUri() !== uri ||
        !this.isReady() ||
        !syncRecordsEqual(this.getLocal(record), expectedLocal) ||
        this.blockReason(record, record)
      )
        return false;

      // Dispatch synchronously before awaiting I/O. Subsequent user edits see this version and their
      // queued writes run after this transaction, so a slow import cannot overwrite a newer edit.
      if (apply) {
        this.store.dispatch(applyFolderSyncRecord(record));
        // Redux already exposes this version, even if persistence fails. Invalidate alongside the
        // application: a later retry may only persist an equal record and skip application entirely.
        if (record.kind === 'session' || record.kind === 'program') {
          this.store.dispatch(setStatsIsDirty(true));
          this.store.dispatch(fetchUpcomingSessions());
          this.store.dispatch(fetchOverallStats());
        }
      }
      if (record.kind === 'exercise-visibility') {
        await this.keyValueStore.setItem(
          hiddenIdsKey,
          JSON.stringify(this.store.getState().storedSessions.hiddenBuiltInIds),
        );
      }
      await atomicWrites(this.db, (tx) => {
        const writes: (() => unknown)[] = [];
        if (record.kind === 'session') {
          if (record.deleted)
            writes.push(() => tx.delete(sessionsSchema).where(eq(sessionsSchema.id, record.id)).run());
          else
            writes.push(() =>
              tx
                .insert(sessionsSchema)
                .values({ id: record.id, active: false, payload: record.data })
                .onConflictDoUpdate({ target: sessionsSchema.id, set: { payload: record.data } })
                .run(),
            );
        } else if (record.kind === 'program') {
          if (record.deleted)
            writes.push(() => tx.delete(programsSchema).where(eq(programsSchema.id, record.id)).run());
          else
            writes.push(() =>
              tx
                .insert(programsSchema)
                .values({ id: record.id, active: false, payload: record.data })
                .onConflictDoUpdate({ target: programsSchema.id, set: { payload: record.data } })
                .run(),
            );
          writes.push(() =>
            tx.update(programsSchema).set({ active: false }).where(eq(programsSchema.active, true)).run(),
          );
          writes.push(() =>
            tx
              .update(programsSchema)
              .set({ active: true })
              .where(eq(programsSchema.id, this.store.getState().program.activePlanId))
              .run(),
          );
        } else if (record.kind === 'exercise') {
          if (record.deleted)
            writes.push(() => tx.delete(exercisesSchema).where(eq(exercisesSchema.id, record.id)).run());
          else
            writes.push(() =>
              tx
                .insert(exercisesSchema)
                .values({ id: record.id, payload: record.data })
                .onConflictDoUpdate({ target: exercisesSchema.id, set: { payload: record.data } })
                .run(),
            );
        }
        writes.push(() =>
          tx
            .insert(folderSyncBaselinesSchema)
            .values({ folderUri: uri, path, payload: record })
            .onConflictDoUpdate({
              target: [folderSyncBaselinesSchema.folderUri, folderSyncBaselinesSchema.path],
              set: { payload: sql.raw(`excluded.${folderSyncBaselinesSchema.payload.name}`) },
            })
            .run(),
        );
        return writes;
      });
      return true;
    });
  }
}
