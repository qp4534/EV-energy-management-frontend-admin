import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand } from '@/constants/theme';

// 재전송 대기시간. 백엔드 EmailVerificationService.RESEND_COOLDOWN과 값을 맞춰둔다 -
// 여기서 보여주는 카운트다운이 실제로 서버가 재요청을 막는 시간과 다르면, 카운트가 끝났는데도
// 서버가 "잠시 후 다시 시도해주세요"로 튕겨내는 혼란스러운 상황이 생긴다.
const RESEND_COOLDOWN_SECONDS = 120;

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
  const [cooldown, setCooldown] = useState(0);
  const wasSending = useRef(sending);

  // 메일 발송 요청이 (에러 없이) 끝나는 순간을 잡아서 카운트다운을 시작한다.
  useEffect(() => {
    if (wasSending.current && !sending && !requestError) {
      setCooldown(RESEND_COOLDOWN_SECONDS);
    }
    wasSending.current = sending;
  }, [sending, requestError]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const requestDisabled = confirmed || sending || cooldown > 0;
  const requestLabel = confirmed
    ? '인증완료'
    : cooldown > 0
      ? `재전송 (${cooldown}s)`
      : requested
        ? '재전송'
        : '이메일 인증';

  return (
    <View style={styles.container}>
      <View style={styles.field}>
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
        <Pressable
          onPress={onRequestCode}
          style={[styles.actionButton, requestDisabled && styles.actionButtonDisabled]}
          disabled={requestDisabled}>
          {sending ? (
            <ActivityIndicator size="small" color={Brand.primaryDark} />
          ) : (
            <Text style={styles.actionButtonText} numberOfLines={1}>
              {requestLabel}
            </Text>
          )}
        </Pressable>
      </View>
      {requestError && <Text style={styles.errorText}>{requestError}</Text>}

      {requested && !confirmed && (
        <Text style={styles.hintText}>
          메일 인증 특성상 인증번호 도착까지 최대 1~2분 정도 걸릴 수 있어요. 조금만 기다려주세요.
        </Text>
      )}

      {requested && (
        <View style={styles.field}>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={onCodeChange}
            placeholder="인증번호 입력"
            placeholderTextColor={Brand.textMuted}
            editable={!confirmed}
          />
          <Pressable
            onPress={onConfirmCode}
            style={[styles.actionButton, (confirmed || confirming) && styles.actionButtonDisabled]}
            disabled={confirmed || confirming}>
            {confirming ? (
              <ActivityIndicator size="small" color={Brand.primaryDark} />
            ) : (
              <Text style={styles.actionButtonText} numberOfLines={1}>
                {confirmed ? '확인 완료' : '인증번호 확인'}
              </Text>
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
    gap: 10,
  },
  field: {
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Brand.text,
    backgroundColor: Brand.card,
  },
  actionButton: {
    borderRadius: 999,
    backgroundColor: Brand.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Brand.primaryDark,
    fontVariant: ['tabular-nums'],
  },
  hintText: {
    fontSize: 12,
    lineHeight: 16,
    color: Brand.textMuted,
  },
  errorText: {
    fontSize: 12,
    color: '#D32F2F',
  },
});
