import { router } from 'expo-router';
import { useState } from 'react';

import * as authApi from '@/api/auth';
import { TERM_KEYS } from '@/constants/terms-content';
import { useSignupTermStore } from '@/store/signup-term-store';
import { getErrorMessage } from '@/utils/error-message';

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
  const [sendingCode, setSendingCode] = useState(false);
  const [confirmingCode, setConfirmingCode] = useState(false);
  const [codeRequestError, setCodeRequestError] = useState<string | null>(null);
  const [codeConfirmError, setCodeConfirmError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { checked: termsChecked, reset: resetTerms } = useSignupTermStore();

  const requestCode = async () => {
    setSendingCode(true);
    setCodeRequestError(null);
    try {
      await authApi.requestVerificationCode(email);
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
    setSubmitError(null);
    try {
      await authApi.signupInfo({
        name,
        email,
        password,
        birthDate: `${birthDate.year}-${String(birthDate.month).padStart(2, '0')}-${String(
          birthDate.day
        ).padStart(2, '0')}`,
        phone,
        consentedTerms: TERM_KEYS.filter((key) => termsChecked[key]),
      });
      resetTerms();
      router.replace('/login');
    } catch (error) {
      setSubmitError(getErrorMessage(error, '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.'));
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
    sendingCode,
    confirmingCode,
    codeRequestError,
    codeConfirmError,
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
    submitError,
    submit,
  };
}
