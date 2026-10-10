import { makeSyncTombstone, syncRecordKey, syncRecordsEqual, type SyncRecord } from '@/models/folder-sync';

export interface SyncRecordVersions {
  /** Last record successfully applied/written by this installation, never a wall-clock timestamp. */
  base?: SyncRecord;
  /** Missing local with a live base means the user deleted that hydrated local record. */
  local?: SyncRecord;
  /** Missing shared files are transport absence, never an instruction to delete. */
  remote?: SyncRecord;
}

export type SyncRecordResolution =
  | { action: 'applyRemote' | 'writeLocal'; record: SyncRecord; base: SyncRecord }
  | { action: 'unchanged'; base: SyncRecord | undefined }
  | { action: 'conflict'; base: SyncRecord | undefined; local: SyncRecord; remote: SyncRecord };

/**
 * Three-way, whole-record reconciliation. Callers persist `base` only AFTER the requested write/apply
 * succeeds. Conflicts preserve both records and the previous base until the user chooses a version.
 */
export function reconcileSyncRecord({ base, local, remote }: SyncRecordVersions): SyncRecordResolution {
  const identity = base ?? local ?? remote;
  for (const record of [base, local, remote]) {
    if (record && identity && syncRecordKey(record) !== syncRecordKey(identity)) {
      throw new Error('Cannot reconcile records with different identities.');
    }
  }

  const localRecord = local ?? (base ? makeSyncTombstone(base.kind, base.id) : undefined);
  if (!remote) {
    return localRecord
      ? { action: 'writeLocal', record: localRecord, base: localRecord }
      : { action: 'unchanged', base: undefined };
  }
  if (!localRecord) return { action: 'applyRemote', record: remote, base: remote };
  if (syncRecordsEqual(localRecord, remote)) return { action: 'unchanged', base: remote };

  if (base && syncRecordsEqual(localRecord, base)) {
    return { action: 'applyRemote', record: remote, base: remote };
  }
  if (base && syncRecordsEqual(remote, base)) {
    return { action: 'writeLocal', record: localRecord, base: localRecord };
  }
  return { action: 'conflict', base, local: localRecord, remote };
}
