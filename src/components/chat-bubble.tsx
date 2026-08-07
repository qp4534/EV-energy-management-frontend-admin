import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

type ChatBubbleProps = {
  message: string;
  fromUser?: boolean;
};

export function ChatBubble({ message, fromUser = false }: ChatBubbleProps) {
  return (
    <ThemedView
      type={fromUser ? 'backgroundSelected' : 'backgroundElement'}
      style={[styles.bubble, fromUser ? styles.alignEnd : styles.alignStart]}>
      <ThemedText type="small">{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  alignStart: {
    alignSelf: 'flex-start',
  },
  alignEnd: {
    alignSelf: 'flex-end',
  },
});
