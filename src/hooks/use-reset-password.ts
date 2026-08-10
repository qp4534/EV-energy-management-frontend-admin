import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { getErrorMessage } from '@/utils/error-message';

export function useResetPassword() {
  const [email, setEmail] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);
  const [codeRequestError, setCodeRequestError] = useState<string | null>(null);
  const [codeConfirmError, setCodeConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const requestCode = async () => {
    setSendingCode(true);
    setCodeRequestError(null);
    try {
      await authApi.requestPasswordResetCode(email);
      setCodeRequested(true);
    } catch (error) {
      setCodeRequestError(getErrorMessage(error, '인증코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'));
    } finally {
      setSendingCode(false);
    }
  };

  const confirmCode = async () => {
    setConfirmingCode(true);
    setCodeConfirmError(null);
    try {
      await authApi.confirmVerificationCode(email, code);
      setCodeConfirmed(true);
    } catch (error) {
      setCodeConfirmError(getErrorMessage(error, '인증번호 확인에 실패했습니다.'));
    } finally {
      setConfirmingCode(false);
    }
  };

  const canSubmit = codeConfirmed && password.length > 0 && password === passwordConfirm;

  const submit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await authApi.resetPassword(email, password);
      setDone(true);
    } catch (error) {
      setSubmitError(getErrorMessage(error, '비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.'));
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => router.replace('/login');
  const goToFindId = () => router.push('/find-id');

  return {
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
    goToFindId,
  };
}
