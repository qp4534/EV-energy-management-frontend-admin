import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';

import { User } from '@/types/auth';

const secureStorage: StateStorage = {
  getItem: async (name) => (await SecureStore.getItemAsync(name)) ?? null,
  setItem: (name, value) => SecureStore.setItemAsync(name, value),
  removeItem: (name) => SecureStore.deleteItemAsync(name),
};

const webStorage: StateStorage = {
  getItem: (name) => Promise.resolve(window.localStorage.getItem(name)),
  setItem: (name, value) => {
    window.localStorage.setItem(name, value);
    return Promise.resolve();
  },
  removeItem: (name) => {
    window.localStorage.removeItem(name);
    return Promise.resolve();
  },
};

type AuthState = {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,
      isHydrated: false,
      login: (token, user) => set({ token, user, isLoggedIn: true }),
      logout: () => set({ token: null, user: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => (Platform.OS === 'web' ? webStorage : secureStorage)),
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
