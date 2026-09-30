import { describe, expect, it } from 'vitest';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { atomicWrites } from '@/db/atomic-writes';
import { createRequire } from 'node:module';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { sql } from 'drizzle-orm';

// Runtime require deliberately bypasses Vitest's Expo-to-libsql resolver, so these tests exercise
// the shipped synchronous Drizzle driver. Node SQLite supplies only Expo's native statement API.
const require = createRequire(import.meta.url);
const { drizzle: nativeDrizzle } = require('drizzle-orm/expo-sqlite/driver') as {
  drizzle(client: unknown): ExpoSQLiteDatabase;
};

function nativeDatabase() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec('CREATE TABLE data (id TEXT PRIMARY KEY); CREATE TABLE baseline (id TEXT PRIMARY KEY);');
  const statements: string[] = [];
  const db = nativeDrizzle({
    prepareSync(query: string) {
      const statement = sqlite.prepare(query);
      return {
        executeSync(params: SQLInputValue[]) {
          statements.push(query);
          const result = statement.run(...params);
          return { changes: Number(result.changes), lastInsertRowId: Number(result.lastInsertRowid) };
        },
      };
    },
  });
  return { db, sqlite, statements };
}

describe('atomicWrites', () => {
  it('runs both writes before COMMIT in the actual Expo Drizzle driver', async () => {
    const { db, sqlite, statements } = nativeDatabase();
    try {
      await atomicWrites(db, (tx) => [
        () => tx.run(sql`INSERT INTO data VALUES ('session')`),
        () => tx.run(sql`INSERT INTO baseline VALUES ('session')`),
      ]);
      expect(statements.map((statement) => statement.trim().split(' ')[0]?.toLowerCase())).toEqual([
        'begin',
        'insert',
        'insert',
        'commit',
      ]);
      expect(sqlite.prepare('SELECT id FROM data').all()).toEqual([{ id: 'session' }]);
      expect(sqlite.prepare('SELECT id FROM baseline').all()).toEqual([{ id: 'session' }]);
    } finally {
      sqlite.close();
    }
  });

  it('rolls back the first write on a baseline failure in the actual Expo Drizzle driver', async () => {
    const { db, sqlite, statements } = nativeDatabase();
    try {
      sqlite.exec(
        "CREATE TRIGGER fail_baseline BEFORE INSERT ON baseline BEGIN SELECT RAISE(ABORT, 'disk full'); END;",
      );
      expect(() =>
        atomicWrites(db, (tx) => [
          () => tx.run(sql`INSERT INTO data VALUES ('session')`),
          () => tx.run(sql`INSERT INTO baseline VALUES ('session')`),
        ]),
      ).toThrow();
      expect(statements.at(-1)?.toLowerCase()).toBe('rollback');
      expect(sqlite.prepare('SELECT id FROM data').all()).toEqual([]);
      expect(sqlite.prepare('SELECT id FROM baseline').all()).toEqual([]);
    } finally {
      sqlite.close();
    }
  });

  it('finishes every native write before a synchronous Expo transaction commits', async () => {
    const events: string[] = [];
    const nativeDb = {
      transaction(callback: (tx: unknown) => unknown) {
        events.push('BEGIN');
        const result = callback({});
        // This is Expo's contract: it does not inspect or await the callback result.
        events.push('COMMIT');
        expect(result).toBeUndefined();
        return result;
      },
    } as unknown as ExpoSQLiteDatabase;
    await atomicWrites(nativeDb, () => [() => events.push('data write'), () => events.push('baseline write')]);
    expect(events).toEqual(['BEGIN', 'data write', 'baseline write', 'COMMIT']);
  });

  it('throws synchronously into the native transaction so a failed later write rolls back', async () => {
    const events: string[] = [];
    const nativeDb = {
      transaction(callback: (tx: unknown) => unknown) {
        try {
          callback({});
          events.push('COMMIT');
        } catch (error) {
          events.push('ROLLBACK');
          throw error;
        }
      },
    } as unknown as ExpoSQLiteDatabase;
    expect(() =>
      atomicWrites(nativeDb, () => [
        () => events.push('data write'),
        () => {
          throw new Error('disk full');
        },
        () => events.push('unexpected write'),
      ]),
    ).toThrow('disk full');
    expect(events).toEqual(['data write', 'ROLLBACK']);
  });

  it('returns the promise chain to an asynchronous driver and executes subsequent writes in order', async () => {
    const events: string[] = [];
    const { promise: barrier, resolve: release } = Promise.withResolvers<void>();
    const asyncDb = {
      async transaction(callback: (tx: unknown) => unknown) {
        events.push('BEGIN');
        await callback({});
        events.push('COMMIT');
      },
    } as unknown as ExpoSQLiteDatabase;
    const done = atomicWrites(asyncDb, () => [
      () => events.push('first write'),
      () =>
        barrier.then(() => {
          events.push('async write');
        }),
      () => events.push('last write'),
    ]);
    expect(events).toEqual(['BEGIN', 'first write']);
    release();
    await done;
    expect(events).toEqual(['BEGIN', 'first write', 'async write', 'last write', 'COMMIT']);
  });
});
