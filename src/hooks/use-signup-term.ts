import { TERMS } from '@/constants/terms-content';
import { useSignupTermStore } from '@/store/signup-term-store';

export type { TermKey } from '@/constants/terms-content';

export function useSignupTerm() {
  const { checked, toggleAll, toggleOne } = useSignupTermStore();

  const allChecked = TERMS.every((term) => checked[term.key]);

  return { terms: TERMS, checked, allChecked, toggleAll, toggleOne };
}
