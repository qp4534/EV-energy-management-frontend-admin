import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { persistStorage } from '@/utils/persist-storage';

export const MAX_LOGIN_ATTEMPTS = 5;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

type LoginAttemptState = {
  attempts: Record<string, number>;
  lockedEmails: Record<string, boolean>;
  recordFailure: (email: string) => { attempts: number; locked: boolean };
  resetAttempts: (email: string) => void;
  isLocked: (email: string) => boolean;
};

export const useLoginAttemptStore = create<LoginAttemptState>()(
  persist(
    (set, get) => ({
      attempts: {},
      lockedEmails: {},
      recordFailure: (email) => {
        const key = normalizeEmail(email);
        const attempts = (get().attempts[key] ?? 0) + 1;
        const locked = attempts >= MAX_LOGIN_ATTEMPTS;
        set((state) => ({
          attempts: { ...state.attempts, [key]: attempts },
          lockedEmails: locked ? { ...state.lockedEmails, [key]: true } : state.lockedEmails,
        }));
        return { attempts, locked };
      },
      resetAttempts: (email) => {
        const key = normalizeEmail(email);
        set((state) => {
          const attempts = { ...state.attempts };
          const lockedEmails = { ...state.lockedEmails };
          delete attempts[key];
          delete lockedEmails[key];
          return { attempts, lockedEmails };
        });
      },
      isLocked: (email) => !!get().lockedEmails[normalizeEmail(email)],
    }),
    {
      name: 'login-attempt-storage',
      storage: createJSONStorage(() => persistStorage),
    }
  )
);
