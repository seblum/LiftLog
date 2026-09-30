import { ProgramBlueprint } from '@/models/blueprint-models';
import { Session } from '@/models/session-models';
import type {
  ExerciseBlueprintJSON,
  ProgramBlueprintJSON,
  RepsTargetJSON,
  RestJSON,
} from '@/models/storage/versions/latest/blueprint';
import type { ExerciseDescriptorJSON } from '@/models/storage/versions/latest/exercise-descriptor';
import type { SessionJSON } from '@/models/storage/versions/latest/session';
import validateSyncRecord from '@/models/generated/validate-folder-sync';
import { Duration } from '@js-joda/core';
import BigNumber from 'bignumber.js';

export type SyncKind = 'session' | 'program' | 'exercise' | 'exercise-visibility';

export interface SyncIdentity {
  kind: SyncKind;
  id: string;
}

interface SyncEnvelope {
  version: 1;
  /** Keep this ID unchanged when editing an existing record. */
  id: string;
}

/** One independently editable record. Removing a file is never a deletion request. */
export type SyncRecord =
  | (SyncEnvelope & { kind: 'session'; deleted: false; data: SessionJSON })
  | (SyncEnvelope & { kind: 'program'; deleted: false; data: ProgramBlueprintJSON })
  | (SyncEnvelope & { kind: 'exercise'; deleted: false; data: ExerciseDescriptorJSON })
  | (SyncEnvelope & { kind: 'exercise-visibility'; deleted: false; data: { hidden: boolean } })
  | (SyncEnvelope & { kind: SyncKind; deleted: true; data: null });

export type ParsedSyncRecord = { ok: true; record: SyncRecord } | { ok: false; error: string };

export const SYNC_RECORD_VERSION = 1;
export const MAX_SYNC_RECORD_BYTES = 10 * 1024 * 1024;

const syncKinds: readonly string[] = ['session', 'program', 'exercise', 'exercise-visibility'];
const forbiddenKeys = new Set([...Object.getOwnPropertyNames(Object.prototype), 'prototype']);

function encodeSyncId(id: string): string {
  // Android's document provider sanitizes '*' despite encodeURIComponent leaving it unescaped.
  return encodeURIComponent(id).replace(
    /[!'()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function isSafeSyncId(id: string): boolean {
  // Named built-in records predate UUIDs. Encoding preserves them, while keeping file names bounded.
  let encoded: string;
  try {
    encoded = encodeSyncId(id);
  } catch {
    return false;
  }
  return (
    id.length > 0 &&
    encoded.length <= 180 &&
    id.trim() === id &&
    !forbiddenKeys.has(id) &&
    !id.includes('.sync-conflict-') &&
    id !== '.' &&
    id !== '..' &&
    !id.split('/').some((part) => part === '.' || part === '..') &&
    !id.includes('\\') &&
    !Array.from(id).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)
  );
}

export function syncRecordKey(record: SyncIdentity): string {
  return `${record.kind}:${record.id}`;
}

export function syncRecordFilename(record: SyncIdentity): string {
  if (!isSafeSyncId(record.id)) {
    throw new Error('The sync record ID is not safe to use as a file name.');
  }
  return `${record.kind}--${encodeSyncId(record.id)}.json`;
}

export function parseSyncRecordFilename(filename: string): SyncIdentity | undefined {
  // Syncthing inserts this suffix before .json; it is a preserved version, not a new record ID.
  if (filename.includes('.sync-conflict-')) return undefined;
  const match = /^(session|program|exercise|exercise-visibility)--(.+)\.json$/.exec(filename);
  if (!match) return undefined;
  try {
    const identity = { kind: match[1] as SyncKind, id: decodeURIComponent(match[2]!) };
    // Require one canonical spelling, including escape case, to prevent duplicate identities.
    return isSafeSyncId(identity.id) && syncRecordFilename(identity) === filename ? identity : undefined;
  } catch {
    return undefined;
  }
}

export function makeSyncTombstone(kind: SyncKind, id: string): SyncRecord {
  return { version: 1, kind, id, deleted: true, data: null };
}

/** Strip the redundant blueprint exercises emitted by Session.toJSON; recordedExercises owns them. */
export function normalizeSyncRecord(record: SyncRecord): SyncRecord {
  if (record.deleted) return record;
  if (record.kind === 'program') {
    return { ...record, data: ProgramBlueprint.fromJSON(record.data).toJSON() };
  }
  if (record.kind === 'session') {
    const data = Session.fromJSON(record.data).toJSON();
    return { ...record, data: { ...data, blueprint: { name: data.blueprint.name, notes: data.blueprint.notes } } };
  }
  return record;
}

export function serializeSyncRecord(record: SyncRecord): string {
  return JSON.stringify(normalizeSyncRecord(record), null, 2) + '\n';
}

function sortedJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortedJson);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, sortedJson(item)]),
    );
  }
  return value;
}

/** Object-key order, whitespace and domain-equivalent decimal/duration spellings aren't edits. */
export function syncRecordsEqual(left: SyncRecord | undefined, right: SyncRecord | undefined): boolean {
  if (left === undefined || right === undefined) return left === right;
  return (
    JSON.stringify(sortedJson(normalizeSyncRecord(left))) === JSON.stringify(sortedJson(normalizeSyncRecord(right)))
  );
}

function containsUnsafeKey(value: unknown, depth = 0): boolean {
  if (depth > 100) return true;
  if (Array.isArray(value)) return value.some((item) => containsUnsafeKey(item, depth + 1));
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).some(([key, item]) => forbiddenKeys.has(key) || containsUnsafeKey(item, depth + 1));
  }
  return false;
}

function assertNonnegativeInteger(value: number, path: string): void {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${path} must be a nonnegative whole number.`);
}

function assertDecimal(value: string, path: string): void {
  if (!new BigNumber(value).isFinite()) throw new Error(`${path} must be a finite decimal.`);
}

function assertReps(value: RepsTargetJSON): void {
  assertNonnegativeInteger(value.min, 'reps.min');
  assertNonnegativeInteger(value.max, 'reps.max');
  if (value.min > value.max) throw new Error('reps.min must not exceed reps.max.');
}

function assertDuration(value: string, path: string): void {
  if (Duration.parse(value).isNegative()) throw new Error(`${path} must not be negative.`);
}

function assertRest(rest: RestJSON): void {
  assertDuration(rest.minRest, 'minRest');
  assertDuration(rest.maxRest, 'maxRest');
  assertDuration(rest.failureRest, 'failureRest');
  if (Duration.parse(rest.minRest).compareTo(Duration.parse(rest.maxRest)) > 0) {
    throw new Error('minRest must not exceed maxRest.');
  }
}

function assertExercise(blueprint: ExerciseBlueprintJSON): void {
  if (blueprint.type === 'WeightedExerciseBlueprint') {
    blueprint.plannedSets.forEach((set) => assertReps(set.reps));
    assertRest(blueprint.restBetweenSets);
    for (const rule of blueprint.progression) {
      assertDecimal(rule.step, 'progression.step');
      if (rule.ceiling !== undefined) assertDecimal(rule.ceiling, 'progression.ceiling');
      if (rule.axis === 'reps') {
        assertNonnegativeInteger(new BigNumber(rule.step).toNumber(), 'progression.step');
        if (rule.ceiling !== undefined) {
          assertNonnegativeInteger(new BigNumber(rule.ceiling).toNumber(), 'progression.ceiling');
        }
      }
    }
  } else {
    for (const set of blueprint.sets) {
      if (set.restBetweenSets) assertRest(set.restBetweenSets);
      if (set.target.type === 'time') assertDuration(set.target.value, 'target.value');
      if (set.target.type === 'distance') {
        assertDecimal(set.target.value.value, 'target.distance');
        if (new BigNumber(set.target.value.value).isNegative())
          throw new Error('Target distance must not be negative.');
      }
    }
  }
}

function assertDomainValues(record: SyncRecord): void {
  if (record.deleted) return;
  if (record.kind === 'program') {
    record.data.sessions.forEach((session) => session.exercises.forEach(assertExercise));
  }
  if (record.kind === 'session') {
    if (record.id !== record.data.id) throw new Error('The record ID must match data.id.');
    if (record.data.bodyweight) assertDecimal(record.data.bodyweight.value, 'bodyweight');
    for (const exercise of record.data.recordedExercises) {
      assertExercise(exercise.blueprint);
      if (exercise.type === 'RecordedWeightedExercise') {
        for (const set of exercise.potentialSets) {
          assertReps(set.target.reps);
          assertDecimal(set.weight.value, 'weight');
          if (set.set) assertNonnegativeInteger(set.set.repsCompleted, 'repsCompleted');
        }
      } else {
        for (const set of exercise.sets) {
          assertExercise({ ...exercise.blueprint, sets: [set.blueprint] });
          if (set.duration) assertDuration(set.duration, 'duration');
          if (set.steps !== undefined) assertNonnegativeInteger(set.steps, 'steps');
          if (set.weight) assertDecimal(set.weight.value, 'weight');
          if (set.incline) assertDecimal(set.incline, 'incline');
          if (set.resistance) assertDecimal(set.resistance, 'resistance');
          if (set.distance) {
            assertDecimal(set.distance.value, 'distance');
            if (new BigNumber(set.distance.value).isNegative())
              throw new Error('Recorded distance must not be negative.');
          }
        }
      }
    }
  }
}

/** Trust gate for both shared files and persisted sync state. No metadata edits are required. */
export function parseSyncRecord(text: string, expectedIdentity?: SyncIdentity): ParsedSyncRecord {
  if (text.length > MAX_SYNC_RECORD_BYTES) return { ok: false, error: 'This sync file exceeds the 10 MiB limit.' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: 'A sync file must contain one record object.' };
  }
  if ('version' in parsed && typeof parsed.version === 'number' && parsed.version > SYNC_RECORD_VERSION) {
    return { ok: false, error: 'This sync file needs a newer version of LiftLog.' };
  }
  if (containsUnsafeKey(parsed)) return { ok: false, error: 'This file contains an unsafe key or excessive nesting.' };
  if (!validateSyncRecord(parsed)) {
    const errors = validateSyncRecord.errors
      ?.slice(0, 4)
      .map((error) => `${error.instancePath || '/'} ${error.message}`);
    return { ok: false, error: `Invalid sync record: ${errors?.join('; ') ?? 'The file does not match the schema.'}` };
  }
  try {
    if (!isSafeSyncId(parsed.id) || !syncKinds.includes(parsed.kind)) throw new Error('The record ID is unsafe.');
    if (expectedIdentity && syncRecordKey(expectedIdentity) !== syncRecordKey(parsed)) {
      throw new Error('The record kind and ID must match its file name.');
    }
    assertDomainValues(parsed);
    return { ok: true, record: normalizeSyncRecord(parsed) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Invalid workout values.' };
  }
}
