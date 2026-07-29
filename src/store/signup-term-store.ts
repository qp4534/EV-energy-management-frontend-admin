import { create } from 'zustand';

import { TERM_KEYS, TermKey } from '@/constants/terms-content';

type CheckedState = Record<TermKey, boolean>;

function allUnchecked(): CheckedState {
  return Object.fromEntries(TERM_KEYS.map((key) => [key, false])) as CheckedState;
}

type SignupTermState = {
  checked: CheckedState;
  toggleAll: () => void;
  toggleOne: (key: TermKey) => void;
  setChecked: (key: TermKey, value: boolean) => void;
  reset: () => void;
};

export const useSignupTermStore = create<SignupTermState>()((set, get) => ({
  checked: allUnchecked(),
  toggleAll: () => {
    const allChecked = TERM_KEYS.every((key) => get().checked[key]);
    const next = !allChecked;
    set({ checked: Object.fromEntries(TERM_KEYS.map((key) => [key, next])) as CheckedState });
  },
  toggleOne: (key) => set((state) => ({ checked: { ...state.checked, [key]: !state.checked[key] } })),
  setChecked: (key, value) => set((state) => ({ checked: { ...state.checked, [key]: value } })),
  reset: () => set({ checked: allUnchecked() }),
}));
