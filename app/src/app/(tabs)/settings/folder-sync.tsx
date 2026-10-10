import { SettingsPage } from '@/components/layout/settings-page';
import Button from '@/components/presentation/foundation/button';
import ConfirmationDialog from '@/components/presentation/foundation/confirmation-dialog';
import { SegmentedGroup, SegmentListFormElement } from '@/components/presentation/foundation/segmented-list';
import { FolderSyncSetup } from '@/components/smart/folder-sync-setup';
import { useServices } from '@/components/smart/services-provider';
import { spacing, useAppTheme } from '@/hooks/useAppTheme';
import type { SyncRecord } from '@/models/folder-sync';
import type { FolderSyncIssue } from '@/services/folder-sync-service';
import { useTranslate } from '@tolgee/react';
import { useState, useSyncExternalStore } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Dialog, Portal, Text } from 'react-native-paper';

export function FolderSyncPage() {
  const { folderSyncService } = useServices();
  const status = useSyncExternalStore(
    folderSyncService.subscribe,
    folderSyncService.getSnapshot,
    folderSyncService.getSnapshot,
  );
  const { t } = useTranslate();
  const { colors } = useAppTheme();
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [reviewedIssue, setReviewedIssue] = useState<FolderSyncIssue>();
  const [resolution, setResolution] = useState<'local' | 'remote'>();

  if (Platform.OS !== 'android') {
    return (
      <SettingsPage title={t('folder_sync.title')}>
        <Text>{t('folder_sync.android_only.message')}</Text>
      </SettingsPage>
    );
  }

  const closeReview = () => {
    setReviewedIssue(undefined);
    setResolution(undefined);
  };

  return (
    <SettingsPage title={t('folder_sync.title')} caption={t('folder_sync.explanation')}>
      <FolderSyncSetup />
      {status.folderUri ? (
        <>
          <SegmentedGroup>
            <SegmentListFormElement
              label={status.isSyncing ? t('folder_sync.syncing.label') : t('folder_sync.last_scan.label')}
              icon="reload"
              supportingText={
                status.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString() : t('folder_sync.not_synced.label')
              }
              right={status.isSyncing ? <ActivityIndicator size="small" /> : undefined}
            />
          </SegmentedGroup>
          <View style={styles.actions}>
            <Button
              testID="syncFolderNow"
              mode="contained"
              icon="reload"
              disabled={status.isSyncing}
              onPress={() => void folderSyncService.sync()}
            >
              {t('folder_sync.sync_now.button')}
            </Button>
            <Button disabled={status.isSyncing} onPress={() => setDisconnectOpen(true)}>
              {t('folder_sync.disconnect.button')}
            </Button>
          </View>
        </>
      ) : undefined}

      <Text variant="bodyMedium">{t('folder_sync.automatic.explanation')}</Text>
      <Text variant="bodyMedium">{t('folder_sync.editing.explanation')}</Text>

      {status.issues.length ? (
        <>
          <Text variant="titleMedium">{t('folder_sync.issues.title')}</Text>
          <SegmentedGroup>
            {status.issues.map((issue) => (
              <SegmentListFormElement
                key={`${issue.kind}:${issue.path}`}
                icon={issue.kind === 'deferred' ? 'info' : 'error'}
                label={
                  issue.kind === 'conflict'
                    ? t('folder_sync.conflict.title')
                    : issue.kind === 'invalid'
                      ? t('folder_sync.invalid.title')
                      : t('folder_sync.deferred.title')
                }
                supportingText={issue.message}
                line2={
                  <View style={styles.issueDetails}>
                    <Text selectable variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                      {issue.path}
                    </Text>
                    {issue.kind === 'conflict' && issue.local && issue.remote ? (
                      <Button
                        disabled={status.isSyncing}
                        onPress={() => {
                          setResolution(undefined);
                          setReviewedIssue(issue);
                        }}
                      >
                        {t('folder_sync.review.button')}
                      </Button>
                    ) : undefined}
                  </View>
                }
              />
            ))}
          </SegmentedGroup>
        </>
      ) : undefined}

      <ConfirmationDialog
        open={disconnectOpen}
        headline={t('folder_sync.disconnect.title')}
        textContent={t('folder_sync.disconnect.message')}
        okText={t('folder_sync.disconnect.button')}
        onCancel={() => setDisconnectOpen(false)}
        onOk={() => {
          setDisconnectOpen(false);
          void folderSyncService.disconnect();
        }}
      />
      {reviewedIssue && !resolution ? (
        <ConflictReview
          issue={reviewedIssue}
          busy={status.isSyncing}
          onDismiss={closeReview}
          onChoose={setResolution}
        />
      ) : undefined}
      <ConfirmationDialog
        open={!!reviewedIssue && !!resolution}
        headline={resolution === 'local' ? t('folder_sync.keep_app.title') : t('folder_sync.use_file.title')}
        textContent={resolution === 'local' ? t('folder_sync.keep_app.message') : t('folder_sync.use_file.message')}
        okText={t('folder_sync.resolve.button')}
        onCancel={() => setResolution(undefined)}
        onOk={() => {
          if (reviewedIssue && resolution) {
            void folderSyncService.resolveConflict(reviewedIssue.path, resolution, reviewedIssue);
          }
          closeReview();
        }}
      />
    </SettingsPage>
  );
}

function ConflictReview(props: {
  issue: FolderSyncIssue;
  busy: boolean;
  onDismiss: () => void;
  onChoose: (choice: 'local' | 'remote') => void;
}) {
  const { t } = useTranslate();
  const { height } = useWindowDimensions();
  return (
    <Portal>
      <Dialog visible onDismiss={props.onDismiss}>
        <Dialog.Title>{t('folder_sync.conflict.title')}</Dialog.Title>
        <Dialog.ScrollArea style={{ maxHeight: height * 0.55 }}>
          <ScrollView contentContainerStyle={styles.reviewContent}>
            <Text>{t('folder_sync.conflict.explanation')}</Text>
            <Text selectable variant="bodySmall">
              {props.issue.path}
            </Text>
            <RecordReview label={t('folder_sync.app_version.label')} record={props.issue.local} />
            <RecordReview label={t('folder_sync.file_version.label')} record={props.issue.remote} />
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions style={styles.reviewActions}>
          <Button disabled={props.busy} onPress={() => props.onChoose('local')}>
            {t('folder_sync.keep_app.button')}
          </Button>
          <Button disabled={props.busy} onPress={() => props.onChoose('remote')}>
            {t('folder_sync.use_file.button')}
          </Button>
          <Button onPress={props.onDismiss}>{t('generic.cancel.button')}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

function RecordReview(props: { label: string; record: SyncRecord | undefined }) {
  const { t } = useTranslate();
  const { colors } = useAppTheme();
  const [showJson, setShowJson] = useState(false);
  const record = props.record;
  if (!record) return undefined;
  const summary = record.deleted
    ? t('folder_sync.deleted.label')
    : record.kind === 'session'
      ? `${record.data.blueprint.name} · ${record.data.date}`
      : record.kind === 'exercise-visibility'
        ? t(record.data.hidden ? 'folder_sync.exercise_hidden.label' : 'folder_sync.exercise_visible.label')
        : record.data.name;
  return (
    <View style={styles.record}>
      <Text variant="titleMedium">{props.label}</Text>
      <Text>{summary}</Text>
      <Button onPress={() => setShowJson(!showJson)}>
        {t(showJson ? 'folder_sync.hide_json.button' : 'folder_sync.show_json.button')}
      </Button>
      {showJson ? (
        <Text selectable variant="bodySmall" style={{ color: colors.onSurfaceVariant, fontFamily: 'monospace' }}>
          {JSON.stringify(record, null, 2)}
        </Text>
      ) : undefined}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
  issueDetails: { marginTop: spacing[3], gap: spacing[2] },
  reviewContent: { paddingVertical: spacing[4], gap: spacing[4] },
  reviewActions: { flexWrap: 'wrap' },
  record: { gap: spacing[2] },
});

// Expo Router requires a default route export; the component remains named for reuse.
export { FolderSyncPage as default };
