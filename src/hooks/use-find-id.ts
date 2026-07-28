import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { FindIdResult } from '@/types/auth';

export function useFindId() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [result, setResult] = useState<FindIdResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const requestCode = async () => {
    await authApi.requestVerificationCode(email);
    setCodeRequested(true);
  };

  const confirmCode = async () => {
    await authApi.confirmVerificationCode(email, code);
    setCodeConfirmed(true);
  };

  const canSubmit = name.length > 0 && codeConfirmed;

  const submit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const found = await authApi.findId(name, email);
      setResult(found);
    } finally {
      setSubmitting(false);
    }
  };

  const goToLogin = () => router.replace('/login');
  const goToResetPassword = () => router.push('/reset-pw');

  return {
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
  };
}
