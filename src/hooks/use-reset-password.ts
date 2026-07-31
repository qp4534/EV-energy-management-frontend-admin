import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { useLoginAttemptStore } from '@/store/login-attempt-store';

export function useResetPassword() {
  const [email, setEmail] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const resetLoginAttempts = useLoginAttemptStore((state) => state.resetAttempts);

  const requestCode = async () => {
    await authApi.requestVerificationCode(email);
    setCodeRequested(true);
  };

  const confirmCode = async () => {
    await authApi.confirmVerificationCode(email, code);
    setCodeConfirmed(true);
  };

  const canSubmit = codeConfirmed && password.length > 0 && password === passwordConfirm;

  const submit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await authApi.resetPassword(email, password);
      resetLoginAttempts(email);
      setDone(true);
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
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    canSubmit,
    submitting,
    submit,
    done,
    goToLogin,
    goToFindId,
  };
}
