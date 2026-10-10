import { afterEach, describe, expect, it, vi } from 'vitest';
import { combineReducers } from '@reduxjs/toolkit';
import { LocalDate } from '@js-joda/core';
import { RemoteData } from '@/models/remote';
import { makeRecordedExercise, makeSession, makeWeightedBlueprint } from '@/models/session-models/__test__/helpers';
import { applyFolderSyncRecord } from '@/store/folder-sync-actions';
import { settingsReducer } from '@/store/settings';
import { applyStatsEffects } from '@/store/stats/effects';
import { fetchOverallStats, statsReducer } from '@/store/stats';
import { storedSessionsReducer } from '@/store/stored-sessions';
import { createAddEffectTestBed } from '@/utils/__test__/add-effect-testbed';

afterEach(() => vi.useRealTimers());

describe('statistics effects', () => {
  it('retries an empty all-time snapshot when the first synced workout arrives during loading', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-30T12:00:00Z'));
    const testBed = createAddEffectTestBed({
      reducer: combineReducers({
        stats: statsReducer,
        storedSessions: storedSessionsReducer,
        settings: settingsReducer,
      }),
      initialState: { stats: { overallViewTime: 'all-time' }, storedSessions: { isHydrated: true } },
    });
    applyStatsEffects(testBed.addEffect);
    const loading = testBed.dispatchHandled(fetchOverallStats());
    expect(testBed.getState().stats.overallView.isLoading()).toBe(true);

    const blueprint = makeWeightedBlueprint({ name: 'Squat' });
    const session = makeSession([blueprint], LocalDate.of(2026, 9, 30)).withExercise(
      0,
      makeRecordedExercise(blueprint, [5, 5, 5]),
    );
    testBed.dispatch(
      applyFolderSyncRecord({ version: 1, kind: 'session', id: session.id, deleted: false, data: session.toJSON() }),
    );
    // The import's eager refresh is ignored while the previous request is still loading.
    await testBed.dispatchHandled(fetchOverallStats());
    await vi.advanceTimersByTimeAsync(200);
    await loading;
    expect(testBed.getState().stats.overallView).toEqual(RemoteData.notAsked());
    expect(testBed.getState().stats.isDirty).toBe(true);
    expect(testBed.getDispatchedAction(fetchOverallStats)).toBeDefined();

    // The testbed records nested dispatches; execute the requested retry explicitly.
    const retry = testBed.dispatchHandled(fetchOverallStats());
    await vi.advanceTimersByTimeAsync(200);
    await retry;
    const result = testBed.getState().stats.overallView;
    expect(result.isSuccess()).toBe(true);
    if (result.isSuccess()) expect(result.data.weightedExerciseStats[0]?.exerciseName).toBe('Squat');
    expect(testBed.getState().stats.isDirty).toBe(false);
  });
});
