import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandInput } from '@/components/common/brand-input';
import { BrandMark } from '@/components/common/brand-mark';
import { Brand } from '@/constants/theme';
import { AccountLockedError, InvalidCredentialsError, useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setSubmitting(true);
    try {
      await login({ email, password });
      setErrorMessage(null);
      setLocked(false);
    } catch (error) {
      if (error instanceof AccountLockedError) {
        setLocked(true);
        setErrorMessage('비밀번호를 5회 잘못 입력하여 계정이 잠겼습니다. 비밀번호 재설정 후 다시 로그인해주세요.');
      } else if (error instanceof InvalidCredentialsError) {
        setLocked(false);
        setErrorMessage(
          `이메일 또는 비밀번호가 올바르지 않습니다. (${error.attemptsRemaining}회 남음)`
        );
      } else {
        setErrorMessage('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrapper}>
            <BrandMark />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>이메일</Text>
              <BrandInput
                icon="envelope"
                value={email}
                onChangeText={setEmail}
                placeholder="123@mijungE.com"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>비밀번호</Text>
              <BrandInput
                icon="lock"
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호 입력"
                secureTextEntry
              />
            </View>

            <View style={styles.linkRow}>
              <Pressable onPress={() => router.push('/find-id')}>
                <Text style={styles.linkText}>아이디 찾기</Text>
              </Pressable>
              <Text style={styles.linkDivider}>|</Text>
              <Pressable onPress={() => router.push('/reset-pw')}>
                <Text style={styles.linkText}>비밀번호 재설정</Text>
              </Pressable>
            </View>

            {errorMessage && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{errorMessage}</Text>
                {locked && (
                  <Pressable onPress={() => router.push('/reset-pw')}>
                    <Text style={styles.errorLinkText}>비밀번호 재설정하러 가기</Text>
                  </Pressable>
                )}
              </View>
            )}

            <Pressable
              style={[styles.loginButton, (locked || submitting) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={locked || submitting}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Text style={styles.signupPrompt}>계정이 없으신가요?</Text>
            <Pressable style={styles.signupButton} onPress={() => router.push('/signup-term')}>
              <Text style={styles.signupButtonText}>회원가입하기</Text>
            </Pressable>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footerLinkRow}>
          <Pressable
            onPress={() => router.push({ pathname: '/term-detail', params: { key: 'service', mode: 'view' } })}>
            <Text style={styles.footerLinkText}>이용약관</Text>
          </Pressable>
          <Text style={styles.footerLinkDivider}>|</Text>
          <Pressable onPress={() => router.push('/privacy-policy')}>
            <Text style={styles.footerLinkText}>개인정보 처리방침</Text>
          </Pressable>
        </View>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoWrapper: {
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacer: {
    flex: 1,
    minHeight: 16,
  },
  card: {
    borderRadius: 15,
    backgroundColor: Brand.card,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Brand.text,
    marginBottom: 4,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: Brand.label,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: -4,
  },
  linkText: {
    fontSize: 12,
    color: Brand.label,
  },
  linkDivider: {
    fontSize: 12,
    color: Brand.border,
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: Brand.warningBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 6,
    marginTop: -4,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: Brand.warningText,
  },
  errorLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.warningText,
    textDecorationLine: 'underline',
  },
  loginButton: {
    borderRadius: 20,
    backgroundColor: Brand.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  signupPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.text,
    marginTop: 12,
  },
  signupButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Brand.border,
    paddingVertical: 14,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  footer: {
    fontSize: 11,
    color: Brand.footerText,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  footerLinkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 18,
  },
  footerLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.footerText,
  },
  footerLinkDivider: {
    fontSize: 12,
    color: Brand.border,
  },
});
