import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BrandInput } from '@/components/common/brand-input';
import { Header } from '@/components/common/header';
import { ResultPanel } from '@/components/common/result-panel';
import { VerifyField } from '@/components/common/verify-field';
import { Brand } from '@/constants/theme';
import { useFindId } from '@/hooks/use-find-id';

export default function FindIdScreen() {
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
    canSubmit,
    submitting,
    submit,
    result,
    goToLogin,
    goToResetPassword,
  } = useFindId();

  return (
    <View style={styles.container}>
      <Header
        title="아이디 찾기"
        showBack
        align="left"
        titleColor={Brand.primaryDark}
        backgroundColor={Brand.background}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {result ? (
          <ResultPanel
            message={'본인확인이 완료되었습니다.\n회원님의 아이디는 아래와 같습니다.'}
            primaryLabel="로그인하기"
            onPrimaryPress={goToLogin}
            secondaryLabel="비밀번호 재설정하기"
            onSecondaryPress={goToResetPassword}>
            <Text style={styles.infoDate}>가입일 {result.joinedAt}</Text>
            <Text style={styles.infoId}>{result.maskedId}</Text>
          </ResultPanel>
        ) : (
          <View style={styles.card}>
            <Text style={styles.description}>가입 시 등록한 이름과 이메일을 입력해주세요.</Text>

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

            <Pressable
              style={[styles.submitButton, (!canSubmit || submitting) && styles.submitButtonDisabled]}
              onPress={submit}
              disabled={!canSubmit || submitting}>
              <Text style={styles.submitButtonText}>아이디 찾기</Text>
            </Pressable>
          </View>
        )}

        {!result && (
          <Pressable style={styles.linkRow} onPress={goToResetPassword}>
            <Text style={styles.linkText}>비밀번호 재설정하기</Text>
          </Pressable>
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
    borderWidth: 1,
    borderColor: Brand.border,
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
  linkRow: {
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primaryDark,
    textDecorationLine: 'underline',
  },
  infoDate: {
    fontSize: 13,
    color: Brand.label,
  },
  infoId: {
    fontSize: 17,
    fontWeight: '800',
    color: Brand.text,
  },
});
