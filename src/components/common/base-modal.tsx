import { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

type BaseModalProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
}>;

export function BaseModal({ visible, onClose, children }: BaseModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={(event) => event.stopPropagation()}>
          {/* DateSelectRow처럼 시스템 다크모드와 무관하게 항상 밝은 배경으로 고정되는
              Brand 화면 전용 모달이라, 시스템 다크모드를 따라가는 ThemedView 대신 Brand
              팔레트를 직접 쓴다 - 안 그러면 배경만 어두워지고 글자색(Brand.text)은 그대로
              고정이라 다크모드에서 글씨가 안 보이는 문제가 있었다. */}
          <View style={styles.content}>{children}</View>
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
    backgroundColor: Brand.card,
  },
});
