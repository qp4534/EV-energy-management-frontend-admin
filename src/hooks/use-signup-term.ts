import { useState } from 'react';

const REQUIRED_TERMS = [
  { key: 'service', label: '[필수] 서비스 이용약관 동의' },
  { key: 'age', label: '[필수] 만 14세 이상입니다' },
  { key: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의' },
  { key: 'location', label: '[필수] 위치기반서비스 이용약관' },
  { key: 'vehicleData', label: '[필수] 차량배터리 진단정보 수집·이용 동의' },
  { key: 'thermalCamera', label: '[필수] 열화상 카메라 영상정보 수집·이용 동의' },
] as const;

export type TermKey = (typeof REQUIRED_TERMS)[number]['key'];

type CheckedState = Record<TermKey, boolean>;

function allUnchecked(): CheckedState {
  return Object.fromEntries(REQUIRED_TERMS.map((term) => [term.key, false])) as CheckedState;
}

export function useSignupTerm() {
  const [checked, setChecked] = useState<CheckedState>(allUnchecked);

  const allChecked = REQUIRED_TERMS.every((term) => checked[term.key]);

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(
      Object.fromEntries(REQUIRED_TERMS.map((term) => [term.key, next])) as CheckedState
    );
  };

  const toggleOne = (key: TermKey) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return { terms: REQUIRED_TERMS, checked, allChecked, toggleAll, toggleOne };
}
