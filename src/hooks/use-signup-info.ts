import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';

type BirthDate = { year: number | null; month: number | null; day: number | null };

export function useSignupInfo() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [codeRequested, setCodeRequested] = useState(false);
  const [code, setCode] = useState('');
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDate>({ year: null, month: null, day: null });
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const requestCode = async () => {
    await authApi.requestVerificationCode(email);
    setCodeRequested(true);
  };

  const confirmCode = async () => {
    await authApi.confirmVerificationCode(email, code);
    setCodeConfirmed(true);
  };

  const canSubmit =
    name.length > 0 &&
    codeConfirmed &&
    password.length > 0 &&
    password === passwordConfirm &&
    birthDate.year !== null &&
    birthDate.month !== null &&
    birthDate.day !== null &&
    phone.length > 0;

  const submit = async () => {
    if (!canSubmit || !birthDate.year || !birthDate.month || !birthDate.day) return;

    setSubmitting(true);
    try {
      await authApi.signupInfo({
        name,
        email,
        password,
        birthDate: `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(
          birthDate.day
        ).padStart(2, '0')}`,
        phone,
      });
      router.replace('/login');
    } finally {
      setSubmitting(false);
    }
  };

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
  };
}
