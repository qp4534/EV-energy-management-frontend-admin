import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { FindIdResult } from '@/types/auth';

type BirthDate = { year: number | null; month: number | null; day: number | null };

export function useFindId() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDate>({ year: null, month: null, day: null });
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<FindIdResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    name.length > 0 &&
    birthDate.year !== null &&
    birthDate.month !== null &&
    birthDate.day !== null &&
    phone.length > 0;

  const submit = async () => {
    if (!canSubmit || !birthDate.year || !birthDate.month || !birthDate.day) return;

    setSubmitting(true);
    try {
      const found = await authApi.findId(
        name,
        `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(
          birthDate.day
        ).padStart(2, '0')}`,
        phone
      );
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
    birthDate,
    setBirthDate,
    phone,
    setPhone,
    canSubmit,
    submitting,
    submit,
    result,
    goToLogin,
    goToResetPassword,
  };
}
