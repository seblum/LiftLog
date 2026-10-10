import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

type Transaction = Parameters<Parameters<ExpoSQLiteDatabase['transaction']>[0]>[0];
type Write = () => unknown;

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return value !== null && typeof value === 'object' && 'then' in value && typeof value.then === 'function';
}

function runWrites(writes: readonly Write[], start = 0): void | Promise<void> {
  for (let index = start; index < writes.length; index++) {
    const result = writes[index]!();
    if (isThenable(result)) {
      return Promise.resolve(result).then(() => runWrites(writes, index + 1));
    }
  }
}

/**
 * Expo commits as soon as its transaction callback returns, so native writes must use `.run()` and
 * stay synchronous. The libsql test driver returns promises from `.run()`; only that case returns a
 * promise from the callback, which its async transaction implementation waits for before committing.
 */
export function atomicWrites(db: ExpoSQLiteDatabase, writes: (tx: Transaction) => readonly Write[]): Promise<void> {
  return Promise.resolve(db.transaction((tx) => runWrites(writes(tx))));
}
