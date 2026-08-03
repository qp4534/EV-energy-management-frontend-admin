import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AgreeCheckboxRow } from '@/components/common/agree-checkbox-row';
import { BrandMark } from '@/components/common/brand-mark';
import { Brand } from '@/constants/theme';
import { useSignupTerm } from '@/hooks/use-signup-term';

export default function SignupTermScreen() {
  const { terms, checked, allChecked, allRequiredChecked, toggleAll, toggleOne } = useSignupTerm();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={20}
              tintColor={Brand.textMuted}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoWrapper}>
            <BrandMark />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>이용약관</Text>

            <View style={styles.allAgreeBox}>
              <AgreeCheckboxRow label="전체 동의하기" checked={allChecked} onToggle={toggleAll} bold />
              <View style={styles.bulletList}>
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>
                    전체 동의 시 필수사항 및 선택사항에 대해 일괄 동의하게 되며, 개별적으로도 동의를
                    선택하실 수 있습니다.
                  </Text>
                </View>
                <View style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>
                    필수 항목은 서비스 제공을 위해 필요한 항목이므로, 동의를 거부하시는 경우 서비스
                    이용에 제한이 있을 수 있습니다.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.termList}>
              {terms.map((term) => (
                <AgreeCheckboxRow
                  key={term.key}
                  label={term.label}
                  checked={checked[term.key]}
                  onToggle={() => toggleOne(term.key)}
                  showChevron={term.hasDetail}
                  onPressDetail={() => router.push({ pathname: '/term-detail', params: { key: term.key } })}
                />
              ))}
            </View>

            <Pressable
              style={[styles.nextButton, !allRequiredChecked && styles.nextButtonDisabled]}
              onPress={() => router.push('/signup-info')}
              disabled={!allRequiredChecked}>
              <Text style={styles.nextButtonText}>다음</Text>
            </Pressable>
          </View>
        </ScrollView>

        <Text style={styles.footer}>@EV energy resource management platform</Text>
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
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  logoWrapper: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 20,
    backgroundColor: Brand.card,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  allAgreeBox: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 16,
    gap: 10,
  },
  bulletList: {
    gap: 6,
    paddingLeft: 28,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 6,
  },
  bulletDot: {
    fontSize: 12,
    lineHeight: 18,
    color: Brand.label,
  },
  bulletText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: Brand.label,
  },
  termList: {
    gap: 14,
  },
  nextButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  footer: {
    fontSize: 11,
    color: Brand.footerText,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
