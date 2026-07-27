import { StyleSheet } from 'react-native';

import { Header } from '@/components/common/header';
import { ThemedView } from '@/components/themed-view';

export default function ResetPasswordScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="비밀번호 재설정" showBack />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
