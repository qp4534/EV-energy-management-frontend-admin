import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';

type VerifyFieldProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onRequestCode: () => void;
  requested: boolean;
  code: string;
  onCodeChange: (value: string) => void;
  onConfirmCode: () => void;
  confirmed: boolean;
  sending?: boolean;
  confirming?: boolean;
  requestError?: string | null;
  confirmError?: string | null;
};

export function VerifyField({
  email,
  onEmailChange,
  onRequestCode,
  requested,
  code,
  onCodeChange,
  onConfirmCode,
  confirmed,
  sending = false,
  confirming = false,
  requestError,
  confirmError,
}: VerifyFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onEmailChange}
          placeholder="이메일 입력"
          placeholderTextColor={Brand.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!confirmed}
        />
        <Pressable onPress={onRequestCode} style={styles.pillButton} disabled={confirmed || sending}>
          {sending ? (
            <ActivityIndicator size="small" color={Brand.primaryDark} />
          ) : (
            <Text style={styles.pillButtonText}>{requested ? '재요청' : '인증 요청'}</Text>
          )}
        </Pressable>
      </View>
      {requestError && <Text style={styles.errorText}>{requestError}</Text>}

      {requested && (
        <View style={styles.row}>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={onCodeChange}
            placeholder="인증번호 입력"
            placeholderTextColor={Brand.textMuted}
            editable={!confirmed}
          />
          <Pressable onPress={onConfirmCode} style={styles.pillButton} disabled={confirmed || confirming}>
            {confirming ? (
              <ActivityIndicator size="small" color={Brand.primaryDark} />
            ) : (
              <Text style={styles.pillButtonText}>{confirmed ? '확인 완료' : '확인'}</Text>
            )}
          </Pressable>
        </View>
      )}
      {confirmError && <Text style={styles.errorText}>{confirmError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.text,
    backgroundColor: Brand.card,
  },
  pillButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.primaryDark,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
  },
});
