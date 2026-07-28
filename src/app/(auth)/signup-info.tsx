import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandInput } from '@/components/common/brand-input';
import { BrandMark } from '@/components/common/brand-mark';
import { DateSelectRow } from '@/components/common/date-select-row';
import { VerifyField } from '@/components/common/verify-field';
import { Brand } from '@/constants/theme';
import { useSignupInfo } from '@/hooks/use-signup-info';

export default function SignupInfoScreen() {
  const {
    name,
    setName,
    email,
    setEmail,
    codeRequested,
    code,
    setCode,
    codeConfirmed,
    requestCode,
    confirmCode,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    birthDate,
    setBirthDate,
    phone,
    setPhone,
    canSubmit,
    submitting,
    submit,
  } = useSignupInfo();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <BrandMark />

          <View style={styles.card}>
            <Text style={styles.title}>Sign In</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>이름</Text>
              <BrandInput value={name} onChangeText={setName} placeholder="이름 입력" />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>이메일</Text>
              <VerifyField
                email={email}
                onEmailChange={setEmail}
                onRequestCode={requestCode}
                requested={codeRequested}
                code={code}
                onCodeChange={setCode}
                onConfirmCode={confirmCode}
                confirmed={codeConfirmed}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>비밀번호</Text>
              <BrandInput
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호 입력"
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>비밀번호 확인</Text>
              <BrandInput
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
                placeholder="비밀번호 재입력"
                secureTextEntry
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>생년월일</Text>
              <DateSelectRow
                year={birthDate.year}
                month={birthDate.month}
                day={birthDate.day}
                onChange={setBirthDate}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>전화번호</Text>
              <BrandInput
                value={phone}
                onChangeText={setPhone}
                placeholder="전화번호 입력"
                keyboardType="phone-pad"
              />
            </View>

            <Pressable
              style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
              onPress={submit}
              disabled={!canSubmit || submitting}>
              <Text style={styles.submitButtonText}>Sign In</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>@EV energy resource management platform</Text>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
  },
  card: {
    borderRadius: 20,
    backgroundColor: Brand.card,
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Brand.text,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: Brand.textMuted,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
  footer: {
    fontSize: 11,
    color: Brand.textMuted,
    textAlign: 'center',
  },
});
