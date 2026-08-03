import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandInput } from '@/components/common/brand-input';
import { BrandMark } from '@/components/common/brand-mark';
import { Brand } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
              <Text style={styles.fieldLabel}>아이디</Text>
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

            <Pressable style={styles.loginButton} onPress={() => login({ email, password })}>
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Text style={styles.signupPrompt}>계정이 없으신가요?</Text>
            <Pressable style={styles.signupButton} onPress={() => router.push('/signup-term')}>
              <Text style={styles.signupButtonText}>회원가입하기</Text>
            </Pressable>
          </View>

          <View style={styles.bottomSpacer} />
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
  loginButton: {
    borderRadius: 20,
    backgroundColor: Brand.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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
    paddingVertical: 16,
  },
});
