import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { makeSyncTombstone, syncRecordsEqual, type SyncRecord } from '@/models/folder-sync';
import { reconcileSyncRecord } from '@/services/folder-sync/reconcile';

function exercise(name: string): SyncRecord {
  return {
    version: 1,
    kind: 'exercise',
    id: 'stable-exercise-id',
    deleted: false,
    data: {
      name,
      force: null,
      level: '',
      mechanic: null,
      equipment: null,
      muscles: [],
      instructions: '',
      category: '',
    },
  };
}
const original = exercise('Original');
const phone = exercise('Phone edit');
const computer = exercise('Computer edit');
const deleted = makeSyncTombstone('exercise', original.id);

describe('folder sync reconciliation', () => {
  it('exports local records and imports remote records on the first sync', () => {
    expect(reconcileSyncRecord({ local: original })).toMatchObject({
      action: 'writeLocal',
      record: original,
      base: original,
    });
    expect(reconcileSyncRecord({ remote: original })).toMatchObject({
      action: 'applyRemote',
      record: original,
      base: original,
    });
    expect(reconcileSyncRecord({})).toEqual({ action: 'unchanged', base: undefined });
  });

  it('refuses to guess which first-sync collision should win', () => {
    expect(reconcileSyncRecord({ local: phone, remote: computer })).toEqual({
      action: 'conflict',
      base: undefined,
      local: phone,
      remote: computer,
    });
  });

  it('applies desktop edits without asking users to increment timestamps or revisions', () => {
    expect(reconcileSyncRecord({ base: original, local: original, remote: computer })).toEqual({
      action: 'applyRemote',
      record: computer,
      base: computer,
    });
  });

  it('publishes app edits when the shared record still matches the base', () => {
    expect(reconcileSyncRecord({ base: original, local: phone, remote: original })).toEqual({
      action: 'writeLocal',
      record: phone,
      base: phone,
    });
  });

  it('preserves both offline edits until the user resolves the conflict', () => {
    const input = { base: original, local: phone, remote: computer };
    const first = reconcileSyncRecord(input);
    expect(first).toEqual({ action: 'conflict', ...input });
    expect(reconcileSyncRecord(input)).toEqual(first);
  });

  it('converges equal independent edits', () => {
    expect(reconcileSyncRecord({ base: original, local: phone, remote: exercise('Phone edit') })).toEqual({
      action: 'unchanged',
      base: phone,
    });
  });

  it('turns a local deletion into an explicit tombstone', () => {
    expect(reconcileSyncRecord({ base: original, remote: original })).toEqual({
      action: 'writeLocal',
      record: deleted,
      base: deleted,
    });
    expect(reconcileSyncRecord({ base: deleted, remote: deleted })).toEqual({ action: 'unchanged', base: deleted });
  });

  it('applies an explicit remote deletion only when local data has not changed', () => {
    expect(reconcileSyncRecord({ base: original, local: original, remote: deleted })).toEqual({
      action: 'applyRemote',
      record: deleted,
      base: deleted,
    });
    expect(reconcileSyncRecord({ base: original, local: phone, remote: deleted })).toMatchObject({
      action: 'conflict',
      local: phone,
      remote: deleted,
    });
    expect(reconcileSyncRecord({ base: original, remote: computer })).toMatchObject({
      action: 'conflict',
      local: deleted,
      remote: computer,
    });
  });

  it('never interprets a missing remote file as a deletion', () => {
    expect(reconcileSyncRecord({ base: original, local: original })).toEqual({
      action: 'writeLocal',
      record: original,
      base: original,
    });
    expect(reconcileSyncRecord({ base: original, local: phone })).toMatchObject({
      action: 'writeLocal',
      record: phone,
    });
    expect(reconcileSyncRecord({ base: deleted })).toMatchObject({ action: 'writeLocal', record: deleted });
  });

  it('allows an explicit edited record to restore a known tombstone', () => {
    expect(reconcileSyncRecord({ base: deleted, remote: computer })).toMatchObject({
      action: 'applyRemote',
      record: computer,
    });
    expect(reconcileSyncRecord({ base: deleted, local: phone, remote: deleted })).toMatchObject({
      action: 'writeLocal',
      record: phone,
    });
  });

  it('rejects mixing identities', () => {
    expect(() => reconcileSyncRecord({ local: original, remote: { ...computer, id: 'other' } })).toThrow(
      'different identities',
    );
  });

  it('is idempotent after successfully applying or publishing any valid edit', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (localName, remoteName) => {
        const local = exercise(localName);
        const remote = exercise(remoteName);
        for (const input of [
          { base: local, local, remote },
          { base: remote, local, remote },
        ]) {
          const result = reconcileSyncRecord(input);
          if (result.action === 'conflict') throw new Error('One unchanged side must not conflict.');
          const converged = result.action === 'unchanged' ? result.base : result.record;
          const next = reconcileSyncRecord({ base: converged, local: converged, remote: converged });
          expect(next.action).toBe('unchanged');
          expect(syncRecordsEqual(next.base, converged)).toBe(true);
        }
      }),
    );
  });
});
