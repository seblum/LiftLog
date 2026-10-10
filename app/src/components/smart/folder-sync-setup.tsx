import Button from '@/components/presentation/foundation/button';
import { useServices } from '@/components/smart/services-provider';
import { spacing, useAppTheme } from '@/hooks/useAppTheme';
import { useAppSelector } from '@/store';
import { useTranslate } from '@tolgee/react';
import { useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

/** The same opt-in is available during onboarding and later in Settings. */
export function FolderSyncSetup() {
  const { folderSyncService } = useServices();
  const status = useSyncExternalStore(
    folderSyncService.subscribe,
    folderSyncService.getSnapshot,
    folderSyncService.getSnapshot,
  );
  const hydrated = useAppSelector((state) => state.settings.isHydrated);
  const { t } = useTranslate();
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: spacing[3] }}>
      <Text variant="bodyMedium">{t('folder_sync.setup.explanation')}</Text>
      {status.folderUri ? (
        <>
          <Text variant="titleSmall">{t('folder_sync.connected.label')}</Text>
          <Text selectable variant="bodySmall">
            {status.folderUri}
          </Text>
        </>
      ) : (
        <Button
          testID="chooseSyncFolder"
          mode="contained"
          icon="reload"
          loading={status.isSyncing}
          disabled={status.isSyncing || !hydrated}
          onPress={() => void folderSyncService.connect()}
        >
          {t('folder_sync.choose_folder.button')}
        </Button>
      )}
      {status.error ? (
        <Text accessibilityRole="alert" style={{ color: colors.error }}>
          {status.error}
        </Text>
      ) : undefined}
      {status.issues.length > 0 ? (
        <Text accessibilityRole="alert" style={{ color: colors.error }}>
          {t('folder_sync.issues.summary', { count: status.issues.length })}
        </Text>
      ) : undefined}
    </View>
  );
}
