import { TERMS } from '@/constants/terms-content';
import { useSignupTermStore } from '@/store/signup-term-store';

export type { TermKey } from '@/constants/terms-content';

export function useSignupTerm() {
  const { checked, toggleAll, toggleOne } = useSignupTermStore();

  const allChecked = TERMS.every((term) => checked[term.key]);
  const allRequiredChecked = TERMS.filter((term) => term.required).every((term) => checked[term.key]);

  return { terms: TERMS, checked, allChecked, allRequiredChecked, toggleAll, toggleOne };
}
