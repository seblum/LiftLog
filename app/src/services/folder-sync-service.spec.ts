import { describe, expect, it } from 'vitest';
import { FolderSyncService, type FolderSyncRepository } from '@/services/folder-sync-service';
import type { SyncDirectory } from '@/services/folder-sync/directory-types';
import {
  makeSyncTombstone,
  serializeSyncRecord,
  syncRecordFilename,
  syncRecordKey,
  syncRecordsEqual,
  type SyncRecord,
} from '@/models/folder-sync';
import { LocalDate } from '@js-joda/core';
import { toLocalDateJSON } from '@/models/storage/versions/latest';

function plan(name = 'Original', id = 'plan-1'): SyncRecord {
  return {
    version: 1,
    kind: 'program',
    id,
    deleted: false,
    data: { version: 3, name, lastEdited: toLocalDateJSON(LocalDate.of(2026, 9, 30)), sessions: [] },
  };
}

function setup(initial: SyncRecord[] = [plan()]) {
  const local = new Map(initial.map((record) => [syncRecordKey(record), record]));
  const files = new Map<string, string>();
  const bases: Record<string, SyncRecord> = {};
  const archives: string[] = [];
  let uri = 'test-folder';
  let blocked: string | undefined;
  let failCommit = false;
  let failArchive = false;
  let afterWrite: (() => void) | undefined;
  const directory: SyncDirectory = {
    list: async () => [...files.keys()],
    read: async (name) => files.get(name),
    write: async (name, content, expected) => {
      if (files.get(name) !== expected) throw new Error('The file changed');
      files.set(name, content);
      afterWrite?.();
    },
    archive: async (_name, content) => {
      if (failArchive) throw new Error('Archive storage unavailable');
      archives.push(content);
    },
    remove: async (name, expected) => {
      if (files.get(name) !== expected) throw new Error('The file changed');
      archives.push(expected);
      files.delete(name);
    },
  };
  const repository: FolderSyncRepository = {
    isReady: () => true,
    getFolderUri: () => uri || undefined,
    setFolderUri: (value) => {
      uri = value;
    },
    listLocal: () => [...local.values()],
    getLocal: (identity) => local.get(syncRecordKey(identity)),
    blockReason: () => blocked,
    baselines: async () => ({ ...bases }),
    commit: async (_uri, path, record, expected, apply) => {
      if (failCommit) throw new Error('Disk full');
      if (!syncRecordsEqual(local.get(syncRecordKey(record)), expected)) return false;
      if (apply) {
        if (record.deleted) local.delete(syncRecordKey(record));
        else local.set(syncRecordKey(record), record);
      }
      bases[path] = record;
      return true;
    },
  };
  const newService = () =>
    new FolderSyncService(repository, { pick: async () => 'test-folder', open: () => directory });
  const service = newService();
  const putFile = (record: SyncRecord) => files.set(syncRecordFilename(record), serializeSyncRecord(record));
  return {
    service,
    newService,
    local,
    files,
    bases,
    archives,
    putFile,
    setBlocked: (value?: string) => {
      blocked = value;
    },
    setFailCommit: (value: boolean) => {
      failCommit = value;
    },
    setFailArchive: (value: boolean) => {
      failArchive = value;
    },
    setAfterWrite: (value?: () => void) => {
      afterWrite = value;
    },
  };
}

describe('FolderSyncService', () => {
  it('exports, accepts a desktop correction after restart, and exports another app correction', async () => {
    const t = setup();
    await t.service.sync();
    expect(t.files.get('program--plan-1.json')).toContain('Original');
    t.putFile(plan('From computer'));
    await t.newService().sync();
    expect(t.local.get('program:plan-1')).toEqual(plan('From computer'));
    t.local.set('program:plan-1', plan('From phone'));
    await t.service.sync();
    expect(t.files.get('program--plan-1.json')).toContain('From phone');
    expect(t.service.getSnapshot().issues).toEqual([]);
  });

  it('imports a newly authored record without disturbing existing records', async () => {
    const t = setup();
    t.putFile(plan('New plan', 'new-id'));
    await t.service.sync();
    expect(t.local.size).toBe(2);
    expect(t.local.get('program:new-id')).toEqual(plan('New plan', 'new-id'));
  });

  it('preserves the previous local snapshot before applying a normal incoming correction', async () => {
    const t = setup();
    await t.service.sync();
    t.putFile(plan('Computer correction'));
    await t.service.sync();
    expect(t.local.get('program:plan-1')).toEqual(plan('Computer correction'));
    expect(t.archives).toContain(serializeSyncRecord(plan()));
  });

  it('keeps the current data and baseline when preserving the old version fails', async () => {
    const t = setup();
    await t.service.sync();
    t.putFile(plan('Computer correction'));
    t.setFailArchive(true);
    await t.service.sync();
    expect(t.local.get('program:plan-1')).toEqual(plan());
    expect(t.bases['program--plan-1.json']).toEqual(plan());
    expect(t.service.getSnapshot().issues[0]?.message).toContain('Archive storage unavailable');
  });

  it('preserves a previous deletion before a shared file restores that record', async () => {
    const t = setup();
    await t.service.sync();
    t.local.clear();
    await t.service.sync();
    t.putFile(plan('Restored on computer'));
    await t.service.sync();
    expect(t.local.get('program:plan-1')).toEqual(plan('Restored on computer'));
    expect(t.archives).toContain(serializeSyncRecord(makeSyncTombstone('program', 'plan-1')));
  });

  it('exports explicit local deletion and never treats a missing file as deletion', async () => {
    const t = setup();
    await t.service.sync();
    t.files.delete('program--plan-1.json');
    await t.service.sync();
    expect(t.local.size).toBe(1);
    expect(t.files.has('program--plan-1.json')).toBe(true);
    t.local.clear();
    await t.service.sync();
    expect(JSON.parse(t.files.get('program--plan-1.json')!)).toEqual(makeSyncTombstone('program', 'plan-1'));
    await t.newService().sync();
    expect(t.local.size).toBe(0);
  });

  it('applies a desktop tombstone without recreating the record on the next scan', async () => {
    const t = setup();
    await t.service.sync();
    t.putFile(makeSyncTombstone('program', 'plan-1'));
    await t.service.sync();
    await t.newService().sync();
    expect(t.local.size).toBe(0);
  });

  it('preserves concurrent changes until reviewed and archives both before resolving', async () => {
    const t = setup();
    await t.service.sync();
    t.local.set('program:plan-1', plan('Phone'));
    t.putFile(plan('Computer'));
    await t.service.sync();
    expect(t.service.getSnapshot().issues[0]?.kind).toBe('conflict');
    expect(t.local.get('program:plan-1')).toEqual(plan('Phone'));
    expect(t.bases['program--plan-1.json']).toEqual(plan());
    await t.service.resolveConflict('program--plan-1.json', 'remote');
    expect(t.local.get('program:plan-1')).toEqual(plan('Computer'));
    expect(t.archives.some((text) => text.includes('Phone'))).toBe(true);
    expect(t.archives.some((text) => text.includes('Computer'))).toBe(true);
    expect(t.service.getSnapshot().issues).toEqual([]);
  });

  it('allows keeping a local deletion in a deletion/edit conflict', async () => {
    const t = setup();
    await t.service.sync();
    t.local.clear();
    t.putFile(plan('Computer'));
    await t.service.sync();
    await t.service.resolveConflict('program--plan-1.json', 'local');
    expect(t.local.size).toBe(0);
    expect(JSON.parse(t.files.get('program--plan-1.json')!)).toEqual(makeSyncTombstone('program', 'plan-1'));
  });

  it('serializes repeated confirmations without applying or archiving the same decision twice', async () => {
    const t = setup();
    t.putFile(plan('Computer'));
    await t.service.sync();
    const review = t.service.getSnapshot().issues[0]!;
    await Promise.all([
      t.service.resolveConflict(review.path, 'remote', review),
      t.service.resolveConflict(review.path, 'remote', review),
    ]);
    expect(t.local.get('program:plan-1')).toEqual(plan('Computer'));
    expect(t.archives).toHaveLength(2);
    expect(t.service.getSnapshot().error).toBeUndefined();
    expect(t.service.getSnapshot().issues).toEqual([]);
  });

  it('refuses a resolution when either reviewed version changed', async () => {
    const t = setup();
    t.putFile(plan('Computer'));
    await t.service.sync();
    t.local.set('program:plan-1', plan('New phone edit'));
    await t.service.resolveConflict('program--plan-1.json', 'remote');
    expect(t.service.getSnapshot().error).toContain('changed');
    expect(t.local.get('program:plan-1')).toEqual(plan('New phone edit'));
    expect(t.archives).toEqual([]);
  });

  it('recognizes and resolves a Syncthing conflict copy, preserving the canonical file too', async () => {
    const t = setup();
    await t.service.sync();
    const path = 'program--plan-1.sync-conflict-20260930-120000-DEVICE.json';
    t.files.set(path, serializeSyncRecord(plan('Conflict copy')));
    await t.service.sync();
    expect(t.service.getSnapshot().issues[0]).toMatchObject({ path, kind: 'conflict' });
    await t.service.resolveConflict(path, 'remote');
    expect(t.local.get('program:plan-1')).toEqual(plan('Conflict copy'));
    expect(t.files.has(path)).toBe(false);
    expect(t.archives.length).toBeGreaterThanOrEqual(3);
  });

  it('offers the canonical remote version too when a conflict copy is also present', async () => {
    const t = setup();
    await t.service.sync();
    t.local.set('program:plan-1', plan('Phone'));
    t.putFile(plan('Canonical computer edit'));
    const path = 'program--plan-1.sync-conflict-20260930-120000-DEVICE.json';
    t.files.set(path, serializeSyncRecord(plan('Conflict copy')));
    await t.service.sync();
    expect(t.service.getSnapshot().issues.map((issue) => issue.path)).toEqual(['program--plan-1.json', path]);
    expect(t.local.get('program:plan-1')).toEqual(plan('Phone'));
  });

  it('refuses a frozen review after a background scan discovers newer file contents', async () => {
    const t = setup();
    t.putFile(plan('Computer'));
    await t.service.sync();
    const oldReview = t.service.getSnapshot().issues[0]!;
    t.putFile(plan('New computer edit'));
    await t.service.sync();
    await t.service.resolveConflict(oldReview.path, 'remote', oldReview);
    expect(t.service.getSnapshot().error).toContain('changed');
    expect(t.local.get('program:plan-1')).toEqual(plan());
  });

  it('requires reviewing a distinct canonical version before replacing it with a conflict copy', async () => {
    const t = setup();
    await t.service.sync();
    t.local.set('program:plan-1', plan('Phone'));
    t.putFile(plan('Canonical computer edit'));
    const path = 'program--plan-1.sync-conflict-20260930-120000-DEVICE.json';
    t.files.set(path, serializeSyncRecord(plan('Conflict copy')));
    await t.service.sync();

    await t.service.resolveConflict(path, 'remote');
    expect(t.service.getSnapshot().error).toContain('Review the main shared file first');
    expect(t.local.get('program:plan-1')).toEqual(plan('Phone'));
    expect(t.files.get('program--plan-1.json')).toBe(serializeSyncRecord(plan('Canonical computer edit')));
    expect(t.archives).toEqual([]);

    await t.service.resolveConflict('program--plan-1.json', 'remote');
    expect(t.local.get('program:plan-1')).toEqual(plan('Canonical computer edit'));
    expect(t.files.has(path)).toBe(true);
    await t.service.resolveConflict(path, 'remote');
    expect(t.local.get('program:plan-1')).toEqual(plan('Conflict copy'));
    expect(t.files.has(path)).toBe(false);
    expect(t.archives.some((text) => text.includes('Canonical computer edit'))).toBe(true);
  });

  it('leaves malformed files and the last good app data untouched', async () => {
    const t = setup();
    await t.service.sync();
    t.files.set('program--plan-1.json', '{partial');
    await t.service.sync();
    expect(t.service.getSnapshot().issues[0]?.kind).toBe('invalid');
    expect(t.files.get('program--plan-1.json')).toBe('{partial');
    expect(t.local.get('program:plan-1')).toEqual(plan());
  });

  it('defers protected records and retries after the protection is removed', async () => {
    const t = setup();
    await t.service.sync();
    t.putFile(plan('Computer'));
    t.setBlocked('Workout in progress');
    await t.service.sync();
    expect(t.service.getSnapshot().issues[0]?.kind).toBe('deferred');
    expect(t.local.get('program:plan-1')).toEqual(plan());
    t.setBlocked();
    await t.service.sync();
    expect(t.local.get('program:plan-1')).toEqual(plan('Computer'));
  });

  it('does not advance the baseline when an outgoing write races a local edit', async () => {
    const t = setup();
    await t.service.sync();
    t.local.set('program:plan-1', plan('First edit'));
    t.setAfterWrite(() => {
      t.local.set('program:plan-1', plan('Second edit'));
    });
    await t.service.sync();
    expect(t.bases['program--plan-1.json']).toEqual(plan());
    expect(t.local.get('program:plan-1')).toEqual(plan('Second edit'));
    expect(t.service.getSnapshot().issues[0]?.kind).toBe('deferred');
    t.setAfterWrite();
    await t.service.sync();
    expect(t.service.getSnapshot().issues[0]?.kind).toBe('conflict');
  });

  it('recovers after a file write succeeds but committing the baseline fails', async () => {
    const t = setup();
    await t.service.sync();
    t.local.set('program:plan-1', plan('Latest'));
    t.setFailCommit(true);
    await t.service.sync();
    expect(t.bases['program--plan-1.json']).toEqual(plan());
    t.setFailCommit(false);
    // Simulate app DB staying at the old value across a crash. The already-written file recovers it.
    t.local.set('program:plan-1', plan());
    await t.newService().sync();
    expect(t.local.get('program:plan-1')).toEqual(plan('Latest'));
  });

  it('coalesces concurrent sync requests and stops writing after disconnect', async () => {
    const t = setup();
    const first = t.service.sync();
    expect(t.service.sync()).toBe(first);
    await first;
    await t.service.disconnect();
    t.putFile(plan('Computer'));
    await t.service.sync();
    expect(t.local.get('program:plan-1')).toEqual(plan());
    expect(t.service.getSnapshot().folderUri).toBeUndefined();
  });
});
