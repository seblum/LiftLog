import { spacing } from '@/hooks/useAppTheme';
import { ProgramBlueprint } from '@/models/blueprint-models';
import { useAppSelector } from '@/store';
import { showSnackbar } from '@/store/app';
import { savePlan, selectAllPrograms } from '@/store/program';
import { T, useTranslate } from '@tolgee/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Dialog, List, Portal, RadioButton, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Button from '@/components/presentation/foundation/button';

type ImportPlanUpdateDialogProps = {
  visible: boolean;
  onDismiss: () => void;
  pending: ProgramBlueprint;
};

export function ImportPlanUpdateDialog({ visible, onDismiss, pending }: ImportPlanUpdateDialogProps) {
  const dispatch = useDispatch();
  const { t } = useTranslate();
  const { replace } = useRouter();
  const allPrograms = useAppSelector(selectAllPrograms);
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');

  const handleUpdate = () => {
    if (!selectedProgramId) {
      return;
    }
    const targetProgram = allPrograms.find(({ id }) => id === selectedProgramId);
    if (!targetProgram) {
      return;
    }

    dispatch(savePlan({ programId: selectedProgramId, programBlueprint: pending }));
    dispatch(
      showSnackbar({
        text: t('plan.import.updated.message', { planName: targetProgram.program.name }),
        action: t('generic.undo.button'),
        dispatchAction: savePlan({ programId: selectedProgramId, programBlueprint: targetProgram.program }),
      }),
    );

    setSelectedProgramId('');
    onDismiss();
    replace(`/settings/program-list?focusprogramId=${selectedProgramId}`);
  };

  const handleDismiss = () => {
    setSelectedProgramId('');
    onDismiss();
  };

  const renderProgramItem = ({ item }: { item: { id: string; program: ProgramBlueprint } }) => (
    <List.Item
      title={item.program.name}
      left={() => (
        <RadioButton
          value={item.id}
          status={selectedProgramId === item.id ? 'checked' : 'unchecked'}
          onPress={() => setSelectedProgramId(item.id)}
        />
      )}
      onPress={() => setSelectedProgramId(item.id)}
    />
  );

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleDismiss}>
        <Dialog.Title>
          <T keyName="plan.import.update_existing.button" />
        </Dialog.Title>
        <Dialog.Content>
          <View style={{ gap: spacing[2] }}>
            <Text variant="bodyMedium">
              <T keyName="plan.import.update_existing.select_plan.label" params={{ planName: pending.name }} />
            </Text>
            {allPrograms.length === 0 ? (
              <Text variant="bodyMedium" style={{ fontStyle: 'italic' }}>
                <T keyName="plan.not_created_yet.message" />
              </Text>
            ) : (
              <View style={{ maxHeight: 200 }}>
                <FlatList data={allPrograms} keyExtractor={(item) => item.id} renderItem={renderProgramItem} />
              </View>
            )}
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleDismiss}>
            <T keyName="generic.cancel.button" />
          </Button>
          <Button onPress={handleUpdate} disabled={!selectedProgramId || allPrograms.length === 0}>
            <T keyName="generic.replace.button" />
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
