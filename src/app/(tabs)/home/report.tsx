import { StyleSheet } from 'react-native';

import { Header } from '@/components/common/header';
import { ThemedView } from '@/components/themed-view';

export default function ReportScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="충전 리포트" showBack />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
