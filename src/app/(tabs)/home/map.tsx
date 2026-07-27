import { StyleSheet } from 'react-native';

import { Header } from '@/components/common/header';
import { ThemedView } from '@/components/themed-view';

export default function MapScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="충전소 지도" showBack />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
