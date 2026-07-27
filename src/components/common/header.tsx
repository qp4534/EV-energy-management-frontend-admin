import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type HeaderProps = {
  title: string;
  showBack?: boolean;
};

export function Header({ title, showBack = false }: HeaderProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.side}>
        {showBack && (
          <Pressable onPress={() => router.back()} hitSlop={Spacing.two}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={theme.text}
            />
          </Pressable>
        )}
      </View>
      <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
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
});
