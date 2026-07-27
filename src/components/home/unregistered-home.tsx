import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function UnregisteredHome() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.centerText}>
        등록된 차량이 없어요
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
        차량을 등록하고 배터리 여권과 충전 리포트를 확인해보세요.
      </ThemedText>
      <Link href="/vehicle" asChild>
        <Pressable>
          <ThemedView type="backgroundSelected" style={styles.button}>
            <ThemedText type="linkPrimary">차량 등록하기</ThemedText>
          </ThemedView>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
});
