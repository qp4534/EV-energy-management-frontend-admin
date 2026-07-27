import { StyleSheet } from 'react-native';

import { Header } from '@/components/common/header';
import { ThemedView } from '@/components/themed-view';

export default function SignupInfoScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="회원 정보 입력" showBack />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
