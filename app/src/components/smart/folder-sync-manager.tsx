import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { useServices } from '@/components/smart/services-provider';
import { useAppStore } from '@/store';

/** Foreground-only scheduling; Android may suspend the process at any point in the background. */
export function FolderSyncManager() {
  const { folderSyncService } = useServices();
  const store = useAppStore();
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let foreground = AppState.currentState === 'active';
    let timer: ReturnType<typeof setTimeout> | undefined;
    let last = store.getState();
    const run = () => {
      if (foreground) void folderSyncService.sync();
    };
    const schedule = () => {
      if (timer) clearTimeout(timer);
      if (foreground) timer = setTimeout(run, 750);
    };
    const unsubscribe = store.subscribe(() => {
      const current = store.getState();
      if (
        current.settings.folderSyncUri !== last.settings.folderSyncUri ||
        current.settings.isHydrated !== last.settings.isHydrated ||
        current.storedSessions.isHydrated !== last.storedSessions.isHydrated ||
        current.program.isHydrated !== last.program.isHydrated ||
        current.storedSessions.sessions !== last.storedSessions.sessions ||
        current.storedSessions.activeSessionId !== last.storedSessions.activeSessionId ||
        current.storedSessions.savedExercises !== last.storedSessions.savedExercises ||
        current.storedSessions.hiddenBuiltInIds !== last.storedSessions.hiddenBuiltInIds ||
        current.program.savedPrograms !== last.program.savedPrograms
      )
        schedule();
      last = current;
    });
    const subscription = AppState.addEventListener('change', (state) => {
      foreground = state === 'active';
      if (foreground) run();
      else if (timer) clearTimeout(timer);
    });
    const interval = setInterval(run, 10_000);
    run();
    return () => {
      unsubscribe();
      subscription.remove();
      clearInterval(interval);
      if (timer) clearTimeout(timer);
    };
  }, [folderSyncService, store]);
  return null;
}
