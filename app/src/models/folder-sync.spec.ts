import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  makeSyncTombstone,
  normalizeSyncRecord,
  parseSyncRecord,
  parseSyncRecordFilename,
  serializeSyncRecord,
  syncRecordFilename,
  syncRecordsEqual,
  type SyncRecord,
} from '@/models/folder-sync';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';
import type { ProgramBlueprintJSON } from '@/models/storage/versions/latest/blueprint';

const planJSON = JSON.parse(
  readFileSync(
    join(
      __dirname,
      '../../../plugins/liftlog-plan-builder/skills/create-liftlog-plan/examples/push-pull-legs.liftlogplan',
    ),
    'utf8',
  ),
) as ProgramBlueprintJSON;
const blueprint = ProgramBlueprint.fromJSON(planJSON);
const session = Session.getEmptySession(blueprint.sessions[0]!, 'kilograms');
const planRecord: SyncRecord = { version: 1, kind: 'program', id: 'test-plan', deleted: false, data: planJSON };
const sessionRecord: SyncRecord = {
  version: 1,
  kind: 'session',
  id: session.id,
  deleted: false,
  data: session.toJSON(),
};
const parse = (value: unknown) => parseSyncRecord(JSON.stringify(value));

describe('folder sync records', () => {
  it.each([planRecord, sessionRecord, makeSyncTombstone('exercise', 'custom-exercise')])(
    'round trips $kind with its stable ID',
    (record) => {
      const result = parseSyncRecord(serializeSyncRecord(record));
      expect(result.ok).toBe(true);
      if (result.ok) expect(syncRecordsEqual(result.record, record)).toBe(true);
    },
  );

  it('exports only one editable copy of each recorded exercise blueprint', () => {
    expect(JSON.parse(serializeSyncRecord(sessionRecord))).toMatchObject({
      data: { blueprint: { name: session.blueprint.name, notes: session.blueprint.notes } },
    });
    expect(serializeSyncRecord(sessionRecord)).not.toContain('"exercises":');
  });

  it('accepts custom exercises and per-exercise visibility', () => {
    expect(
      parse({
        version: 1,
        kind: 'exercise',
        id: 'exercise-id',
        deleted: false,
        data: {
          name: 'Cable squat',
          force: null,
          level: 'beginner',
          mechanic: null,
          equipment: null,
          muscles: ['quadriceps'],
          instructions: '',
          category: 'strength',
        },
      }).ok,
    ).toBe(true);
    expect(
      parse({ version: 1, kind: 'exercise-visibility', id: 'Barbell Squat', deleted: false, data: { hidden: true } })
        .ok,
    ).toBe(true);
  });

  it.each(['not JSON', '[]', 'null'])('rejects malformed input: %s', (value) => {
    expect(parseSyncRecord(value).ok).toBe(false);
  });

  it('reports a newer envelope version without importing it', () => {
    expect(parse({ ...planRecord, version: 2 })).toEqual({
      ok: false,
      error: 'This sync file needs a newer version of LiftLog.',
    });
  });

  it('rejects a newer payload version', () => {
    expect(parse({ ...planRecord, data: { ...planJSON, version: 999 } }).ok).toBe(false);
  });

  it('rejects kind, payload and deletion mismatches', () => {
    expect(parse({ ...planRecord, kind: 'unknown' }).ok).toBe(false);
    expect(parse({ ...planRecord, data: { hidden: false } }).ok).toBe(false);
    expect(parse({ ...planRecord, deleted: true }).ok).toBe(false);
    expect(parse({ ...planRecord, deleted: false, data: null }).ok).toBe(false);
  });

  it('requires the session identity to match the envelope and filename', () => {
    expect(parse({ ...sessionRecord, id: 'another-id' })).toMatchObject({ ok: false });
    expect(parseSyncRecord(serializeSyncRecord(planRecord), { kind: 'program', id: 'another-plan' }).ok).toBe(false);
    expect(parseSyncRecord(serializeSyncRecord(planRecord), { kind: 'program', id: 'test-plan' }).ok).toBe(true);
  });

  it.each([
    '',
    '__proto__',
    'constructor',
    'toString',
    'hasOwnProperty',
    '..',
    '../outside',
    'a\\b',
    'line\nbreak',
    ' trailing ',
    'x'.repeat(181),
  ])('rejects unsafe ID %j', (id) => expect(parse({ ...planRecord, id }).ok).toBe(false));

  it('rejects prototype keys at any depth before domain construction', () => {
    expect(parseSyncRecord(serializeSyncRecord(planRecord).replace('"name":', '"__proto__": {}, "name":')).ok).toBe(
      false,
    );
  });

  it('catches invalid decimal values, impossible dates and reversed rep bands', () => {
    expect(parse({ ...planRecord, data: { ...planJSON, lastEdited: '2026-02-30' } }).ok).toBe(false);
    const text = serializeSyncRecord(sessionRecord);
    expect(parseSyncRecord(text.replace('"value": "0"', '"value": "NaN"')).ok).toBe(false);
    expect(parseSyncRecord(text.replace('"min": 5', '"min": 999')).ok).toBe(false);
  });

  it('checks duration parsing and domain constraints beyond the schema', () => {
    const text = serializeSyncRecord(planRecord);
    // ISO calendar durations can match a duration schema, but Joda Duration cannot parse months.
    expect(parseSyncRecord(text.replace(/"minRest": "[^"]+"/, '"minRest": "P1M"')).ok).toBe(false);
    expect(parseSyncRecord(text.replace(/"minRest": "[^"]+"/, '"minRest": "PT999M"')).ok).toBe(false);
    expect(parseSyncRecord(text.replace(/"minRest": "[^"]+"/, '"minRest": "-PT1M"')).ok).toBe(false);
  });

  it('does not consider formatting, property order or equivalent durations to be changes', () => {
    const normalized = normalizeSyncRecord(planRecord);
    const reversed = Object.fromEntries(Object.entries(normalized).reverse()) as SyncRecord;
    expect(syncRecordsEqual(normalized, reversed)).toBe(true);
    const equivalent = parseSyncRecord(serializeSyncRecord(planRecord).replace(/"PT3M"/g, '"PT180S"'));
    expect(equivalent.ok).toBe(true);
    if (equivalent.ok) expect(syncRecordsEqual(planRecord, equivalent.record)).toBe(true);
  });

  it('creates portable canonical filenames for existing named IDs', () => {
    const identity = { kind: 'exercise-visibility' as const, id: '3/4 Sit-Up' };
    const filename = syncRecordFilename(identity);
    expect(filename).toBe('exercise-visibility--3%2F4%20Sit-Up.json');
    expect(parseSyncRecordFilename(filename)).toEqual(identity);
    expect(syncRecordFilename({ kind: 'exercise', id: 'A * B' })).toBe('exercise--A%20%2A%20B.json');
    expect(parseSyncRecordFilename('exercise--%2e%2e.json')).toBeUndefined();
    expect(parseSyncRecordFilename('exercise--bad%ZZ.json')).toBeUndefined();
    expect(parseSyncRecordFilename('exercise--x.sync-conflict-20260930.json')).toBeUndefined();
    // The caller checks the parsed payload ID, so transport conflict copies cannot masquerade as originals.
    expect(
      parseSyncRecord(serializeSyncRecord(planRecord), { kind: 'program', id: 'test-plan.sync-conflict-20260930' }).ok,
    ).toBe(false);
  });
});
