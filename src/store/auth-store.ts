import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { persistStorage } from '@/utils/persist-storage';
import { User } from '@/types/auth';

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (token: string, user: User) => void;
  updateUser: (patch: Partial<User>) => void;
  logout: () => void;
  withdraw: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      isHydrated: false,
      login: (token, user) => set({ token, user, isLoggedIn: true }),
      updateUser: (patch) => set((state) => ({ user: state.user ? { ...state.user, ...patch } : state.user })),
      logout: () => set({ token: null, user: null, isLoggedIn: false }),
      withdraw: () => set({ token: null, user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => persistStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ isHydrated: true });
      },
    }
  )
);
