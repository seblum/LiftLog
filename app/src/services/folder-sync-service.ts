import {
  makeSyncTombstone,
  parseSyncRecord,
  parseSyncRecordFilename,
  serializeSyncRecord,
  syncRecordFilename,
  syncRecordsEqual,
  type SyncIdentity,
  type SyncRecord,
} from '@/models/folder-sync';
import { reconcileSyncRecord } from '@/services/folder-sync/reconcile';
import type { SyncDirectories, SyncDirectory } from '@/services/folder-sync/directory-types';
import syncSchema from '@/models/generated/folder-sync.schema.json';

export interface FolderSyncIssue {
  path: string;
  kind: 'conflict' | 'invalid' | 'deferred';
  message: string;
  local?: SyncRecord;
  remote?: SyncRecord;
}

export interface FolderSyncStatus {
  folderUri?: string;
  isSyncing: boolean;
  lastSyncedAt?: string;
  error?: string;
  issues: FolderSyncIssue[];
}

export interface FolderSyncRepository {
  isReady(): boolean;
  getFolderUri(): string | undefined;
  setFolderUri(uri: string): void;
  listLocal(): SyncRecord[];
  getLocal(identity: SyncIdentity): SyncRecord | undefined;
  blockReason(record: SyncIdentity, incoming?: SyncRecord): string | undefined;
  baselines(uri: string): Promise<Record<string, SyncRecord>>;
  /** Atomically persist the record and baseline; check current state before applying a stale scan. */
  commit(
    uri: string,
    path: string,
    record: SyncRecord,
    expectedLocal: SyncRecord | undefined,
    apply: boolean,
  ): Promise<boolean>;
}

interface ConflictReview {
  directoryUri: string;
  path: string;
  canonicalPath: string;
  text: string;
  canonicalText: string | undefined;
  local: SyncRecord | undefined;
  remote: SyncRecord;
}

const instructions = `# LiftLog folder sync

Share this folder between your phone and computer using Syncthing (Send & Receive).
LiftLog scans it when opened/resumed, after app edits and every 10 seconds while open.

Edit the data in one session--ID.json, program--ID.json or exercise--ID.json file.
Keep version, kind and id unchanged. For sessions, data.id must also stay unchanged.
Create a new record using a new UUID in both the file name and id fields.
Weights/distances are decimal strings and include units. Preserve those units.
Dates use ISO formats. Use LiftLog.schema.json for editor/AI validation.
The separate program and session payloads have their own version fields: retain them.

To delete a record, set deleted to true and data to null. Removing a file is NOT a
deletion request: missing files are recreated. Do not edit metadata to resolve conflicts.
exercise-visibility records have data: { "hidden": true } to hide a built-in exercise.

Concurrent edits are preserved for review in Settings > Folder sync. A workout in progress
is kept local until finished. Imported corrections update statistics and progression;
they do not publish a new social feed item or export a workout to Health Connect.
At least one plan must remain. To remove the last plan, add another first.

Files with .sync-conflict- in their name require review in the app. Archive/history and
temporary files are managed by LiftLog. Keep preserved versions until you no longer need them.
The folder contains readable training data; share it only with your own trusted devices.
App settings, service credentials, social feeds and active-workout state are not synced.
`;

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Coordinates file transport and whole-record reconciliation. Has no dependency on Android APIs. */
export class FolderSyncService {
  private status: FolderSyncStatus = { isSyncing: false, issues: [] };
  private readonly listeners = new Set<() => void>();
  private inFlight?: Promise<void>;
  private reviews = new Map<string, ConflictReview>();

  constructor(
    private readonly repository: FolderSyncRepository,
    private readonly directories: SyncDirectories,
  ) {}

  getSnapshot = (): FolderSyncStatus => this.status;
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private update(status: Partial<FolderSyncStatus>) {
    this.status = { ...this.status, ...status };
    this.listeners.forEach((listener) => listener());
  }

  refreshConfiguration() {
    const uri = this.repository.getFolderUri() || undefined;
    if (uri !== this.status.folderUri) {
      this.reviews.clear();
      this.update({ folderUri: uri, issues: [], error: undefined, lastSyncedAt: undefined });
    }
  }

  connect = async (): Promise<void> => {
    try {
      const uri = await this.directories.pick();
      if (!uri) return;
      while (this.inFlight) await this.inFlight;
      this.repository.setFolderUri(uri);
      this.refreshConfiguration();
      await this.sync();
    } catch (error) {
      this.update({ error: errorText(error) });
    }
  };

  disconnect = async (): Promise<void> => {
    while (this.inFlight) await this.inFlight;
    this.repository.setFolderUri('');
    this.refreshConfiguration();
  };

  sync = (): Promise<void> => {
    if (this.inFlight) return this.inFlight;
    this.refreshConfiguration();
    if (!this.status.folderUri || !this.repository.isReady()) return Promise.resolve();
    this.inFlight = this.scan(this.status.folderUri)
      .catch((error: unknown) => this.update({ error: errorText(error) }))
      .finally(() => {
        this.inFlight = undefined;
        this.update({ isSyncing: false });
      });
    return this.inFlight;
  };

  private async scan(uri: string) {
    this.update({ isSyncing: true, error: undefined });
    const directory = this.directories.open(uri);
    const names = await directory.list();
    const baselines = await this.repository.baselines(uri);
    const issues: FolderSyncIssue[] = [];
    this.reviews.clear();
    const variants = new Map<string, string[]>();
    const paths = new Set([...Object.keys(baselines), ...this.repository.listLocal().map(syncRecordFilename)]);
    for (const name of names) {
      if (parseSyncRecordFilename(name)) paths.add(name);
      else if (name.includes('.sync-conflict-') && name.endsWith('.json')) {
        const canonical = name.replace(/\.sync-conflict-[^.]+(?=\.json$)/, '');
        if (parseSyncRecordFilename(canonical)) {
          paths.add(canonical);
          variants.set(canonical, [...(variants.get(canonical) ?? []), name]);
        }
      }
    }

    for (const path of paths) {
      if (this.repository.getFolderUri() !== uri) return;
      const identity = parseSyncRecordFilename(path);
      if (!identity) continue;
      try {
        const text = await directory.read(path);
        const parsed = text === undefined ? undefined : parseSyncRecord(text, identity);
        if (parsed && !parsed.ok) {
          issues.push({ path, kind: 'invalid', message: parsed.error });
          continue;
        }
        const remote = parsed?.record;
        const local = this.repository.getLocal(identity);
        const blocked = this.repository.blockReason(identity, remote);
        if (blocked) {
          issues.push({ path, kind: 'deferred', message: blocked });
          continue;
        }
        const copies = variants.get(path) ?? [];
        if (copies.length) {
          // Syncthing's losing variant may be the desired correction. Do not advance a baseline or
          // overwrite the canonical record until every variant has been explicitly reviewed.
          if (remote && !syncRecordsEqual(local, remote)) {
            this.addConflict(issues, {
              directoryUri: uri,
              path,
              canonicalPath: path,
              text: text!,
              canonicalText: text,
              local,
              remote,
            });
          }
          for (const copy of copies) {
            const copyText = await directory.read(copy);
            if (copyText === undefined) continue;
            const copyParsed = parseSyncRecord(copyText, identity);
            if (!copyParsed.ok) {
              issues.push({ path: copy, kind: 'invalid', message: copyParsed.error });
              continue;
            }
            this.addConflict(issues, {
              directoryUri: uri,
              path: copy,
              canonicalPath: path,
              text: copyText,
              canonicalText: text,
              local,
              remote: copyParsed.record,
            });
          }
          continue;
        }
        // Visible is the default for catalog entries, not an authored competing change on a fresh
        // connection. Previously synced visibility still participates in normal three-way merging.
        const defaultVisibility =
          !baselines[path] && local?.kind === 'exercise-visibility' && !local.deleted && !local.data.hidden;
        const resolution = reconcileSyncRecord({
          base: baselines[path],
          local: defaultVisibility ? undefined : local,
          remote,
        });
        if (resolution.action === 'conflict') {
          this.addConflict(issues, {
            directoryUri: uri,
            path,
            canonicalPath: path,
            text: text!,
            canonicalText: text,
            local,
            remote: resolution.remote,
          });
          continue;
        }
        if (!resolution.base) continue;
        if (resolution.action === 'writeLocal') {
          // The platform adapter rechecks the exact bytes immediately before replacement.
          await directory.write(path, serializeSyncRecord(resolution.record), text);
        } else if (resolution.action === 'applyRemote') {
          if ((await directory.read(path)) !== text)
            throw new Error('The file changed during the scan. Retrying on the next scan.');
          const previous = local ?? (baselines[path] ? makeSyncTombstone(identity.kind, identity.id) : undefined);
          if (previous && !syncRecordsEqual(previous, resolution.record)) {
            await directory.archive(path, serializeSyncRecord(previous));
          }
        }
        if (!syncRecordsEqual(baselines[path], resolution.base) || resolution.action === 'applyRemote') {
          if (!(await this.repository.commit(uri, path, resolution.base, local, resolution.action === 'applyRemote'))) {
            issues.push({
              path,
              kind: 'deferred',
              message: 'This record changed in the app during sync. It will be checked again.',
            });
          }
        }
      } catch (error) {
        issues.push({ path, kind: 'invalid', message: errorText(error) });
      }
    }
    await this.ensureHelpFile(directory, 'LiftLog.README.txt', instructions);
    await this.ensureHelpFile(directory, 'LiftLog.schema.json', JSON.stringify(syncSchema, null, 2) + '\n');
    this.update({ issues, lastSyncedAt: new Date().toISOString() });
  }

  private async ensureHelpFile(directory: SyncDirectory, name: string, text: string) {
    const previous = await directory.read(name);
    if (previous !== text) await directory.write(name, text, previous);
  }

  private addConflict(issues: FolderSyncIssue[], review: ConflictReview) {
    this.reviews.set(review.path, review);
    issues.push({
      path: review.path,
      kind: 'conflict',
      message: 'Both versions are preserved. Review the app and file versions before choosing.',
      local: review.local ?? makeSyncTombstone(review.remote.kind, review.remote.id),
      remote: review.remote,
    });
  }

  resolveConflict = async (
    path: string,
    choice: 'local' | 'remote',
    expected?: Pick<FolderSyncIssue, 'local' | 'remote'>,
  ): Promise<void> => {
    while (this.inFlight) await this.inFlight;
    const review = this.reviews.get(path);
    if (!review) return;
    if (
      expected &&
      (!syncRecordsEqual(expected.local, review.local ?? makeSyncTombstone(review.remote.kind, review.remote.id)) ||
        !syncRecordsEqual(expected.remote, review.remote))
    ) {
      this.update({
        error: 'The versions changed while this review was open. Close it and review the latest versions.',
      });
      return;
    }
    this.inFlight = this.resolve(review, choice)
      .catch((error: unknown) => this.update({ error: errorText(error) }))
      .finally(() => {
        this.inFlight = undefined;
        this.update({ isSyncing: false });
      });
    await this.inFlight;
    if (!this.status.error) await this.sync();
  };

  private async resolve(review: ConflictReview, choice: 'local' | 'remote') {
    const { directoryUri: uri, path, canonicalPath, local, remote } = review;
    if (this.repository.getFolderUri() !== uri)
      throw new Error('The selected folder changed. Scan it again before resolving.');
    this.update({ isSyncing: true, error: undefined });
    const directory = this.directories.open(uri);
    if (
      !syncRecordsEqual(this.repository.getLocal(remote), local) ||
      (await directory.read(path)) !== review.text ||
      (await directory.read(canonicalPath)) !== review.canonicalText
    ) {
      throw new Error('A version changed since you opened this review. Sync again and review the latest versions.');
    }
    if (path !== canonicalPath && review.canonicalText !== undefined) {
      const canonical = parseSyncRecord(review.canonicalText, remote);
      const displayedLocal = local ?? makeSyncTombstone(remote.kind, remote.id);
      if (!canonical.ok || !syncRecordsEqual(canonical.record, displayedLocal)) {
        throw new Error(
          'Review the main shared file first. It has a different version that must be reviewed before this conflict copy.',
        );
      }
    }
    const selected = choice === 'remote' ? remote : (local ?? makeSyncTombstone(remote.kind, remote.id));
    const blocked = this.repository.blockReason(selected, selected);
    if (blocked) throw new Error(blocked);
    await directory.archive(canonicalPath, serializeSyncRecord(local ?? makeSyncTombstone(remote.kind, remote.id)));
    await directory.archive(path, review.text);
    if (review.canonicalText !== undefined && review.canonicalText !== review.text) {
      await directory.archive(canonicalPath, review.canonicalText);
    }
    await directory.write(canonicalPath, serializeSyncRecord(selected), review.canonicalText);
    if (!(await this.repository.commit(uri, canonicalPath, selected, local, true))) {
      throw new Error('The app changed during resolution. Both versions have been preserved; sync and review again.');
    }
    if (path !== canonicalPath) await directory.remove(path, review.text);
  }
}
