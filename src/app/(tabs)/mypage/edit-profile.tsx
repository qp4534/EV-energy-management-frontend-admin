import { StyleSheet } from 'react-native';

import { Header } from '@/components/common/header';
import { ThemedView } from '@/components/themed-view';

export default function EditProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="프로필 수정" showBack />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
