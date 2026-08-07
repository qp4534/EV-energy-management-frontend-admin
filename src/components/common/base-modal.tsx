import { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type BaseModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function BaseModal({ visible, onClose, children }: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          <ThemedView type="backgroundElement" style={styles.content}>
            {children}
          </ThemedView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    minWidth: 280,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
});
