import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { FindIdResult } from '@/types/auth';
import { getErrorMessage } from '@/utils/error-message';

type BirthDate = { year: number | null; month: number | null; day: number | null };

export function useFindId() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<BirthDate>({ year: null, month: null, day: null });
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<FindIdResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit =
    name.length > 0 &&
    birthDate.year !== null &&
    birthDate.month !== null &&
    birthDate.day !== null &&
    phone.length > 0;

  const submit = async () => {
    if (!canSubmit || !birthDate.year || !birthDate.month || !birthDate.day) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const found = await authApi.findId(
        name,
        `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(
          birthDate.day
        ).padStart(2, '0')}`,
        phone
      );
      setResult(found);
    } catch (error) {
      setSubmitError(getErrorMessage(error, '일치하는 계정을 찾을 수 없습니다.'));
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
    submitError,
    submit,
    result,
    goToLogin,
    goToResetPassword,
  };
}
