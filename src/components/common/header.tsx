import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HeaderProps = {
  title: string;
  showBack?: boolean;
  titleColor?: string;
  align?: 'center' | 'left';
  backgroundColor?: string;
  onBackPress?: () => void;
};

export function Header({
  title,
  showBack = false,
  titleColor,
  align = 'center',
  backgroundColor,
  onBackPress,
}: HeaderProps) {
  const theme = useTheme();
  const handleBack = onBackPress ?? (() => router.back());

  if (align === 'left') {
    return (
      <ThemedView style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
        {showBack && (
          <Pressable onPress={handleBack} hitSlop={Spacing.two}>
            <Feather name="chevron-left" size={24} color={titleColor ?? theme.text} />
          </Pressable>
        )}
        <ThemedText
          type="default"
          style={[styles.titleLeft, titleColor ? { color: titleColor } : null]}
          numberOfLines={1}>
          {title}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, backgroundColor ? { backgroundColor } : null]}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={handleBack} hitSlop={Spacing.two}>
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
        )}
      </View>
      <ThemedText
        type="subtitle"
        style={[styles.title, titleColor ? { color: titleColor } : null]}
        numberOfLines={1}>
        {title}
      </ThemedText>
      <View style={styles.side} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    gap: Spacing.two,
  },
  side: {
    width: Spacing.five,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  titleLeft: {
    fontSize: 20,
    fontWeight: '700',
  },
});
