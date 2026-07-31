import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SimpleMarkdown } from '@/components/common/simple-markdown';
import { PRIVACY_POLICY_MARKDOWN } from '@/constants/privacy-policy-content';
import { Brand } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color={Brand.text} />
          </Pressable>
          <Text style={styles.headerTitle}>개인정보 처리방침</Text>
        </View>

        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
          <SimpleMarkdown content={PRIVACY_POLICY_MARKDOWN} />
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.confirmButton} onPress={() => router.back()}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  confirmButton: {
    borderRadius: 999,
    backgroundColor: Brand.primaryDark,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
