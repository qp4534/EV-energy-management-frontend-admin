import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandInput } from '@/components/common/brand-input';
import { Header } from '@/components/common/header';
import { ResultPanel } from '@/components/common/result-panel';
import { VerifyField } from '@/components/common/verify-field';
import { Brand } from '@/constants/theme';
import { useResetPassword } from '@/hooks/use-reset-password';

export default function ResetPasswordScreen() {
  const {
    email,
    setEmail,
    codeRequested,
    code,
    setCode,
    codeConfirmed,
    requestCode,
    confirmCode,
    sendingCode,
    confirmingCode,
    codeRequestError,
    codeConfirmError,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    canSubmit,
    submitting,
    submitError,
    submit,
    done,
    goToLogin,
  } = useResetPassword();

  return (
    <View style={styles.container}>
      <Header
        title="비밀번호 재설정"
        showBack
        align="left"
        titleColor={Brand.primaryDark}
        backgroundColor={Brand.background}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {done ? (
          <ResultPanel
            message={'비밀번호 변경이 완료되었습니다.\n이제 로그인 하실 수 있습니다.'}
            primaryLabel="로그인하기"
            onPrimaryPress={goToLogin}
          />
        ) : (
          <View style={styles.card}>
            <Text style={styles.description}>가입한 이메일로 인증 후 새 비밀번호를 설정해주세요.</Text>

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
                sending={sendingCode}
                confirming={confirmingCode}
                requestError={codeRequestError}
                confirmError={codeConfirmError}
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

            {submitError && <Text style={styles.errorText}>{submitError}</Text>}

            <Pressable
              style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
              onPress={submit}
              disabled={!canSubmit || submitting}>
              <Text style={styles.submitButtonText}>비밀번호 변경</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
  },
  card: {
    borderRadius: 20,
    backgroundColor: Brand.card,
    padding: 24,
    gap: 14,
  },
  description: {
    fontSize: 14,
    color: Brand.primaryDark,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: Brand.label,
  },
  errorText: {
    fontSize: 13,
    color: '#D32F2F',
    textAlign: 'center',
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
    fontSize: 16,
    fontWeight: '800',
    color: Brand.primaryDark,
  },
});
