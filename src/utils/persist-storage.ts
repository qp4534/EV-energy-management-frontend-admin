import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { StateStorage } from 'zustand/middleware';

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

/** 네이티브는 SecureStore, 웹은 localStorage에 zustand persist 상태를 저장한다. */
export const persistStorage: StateStorage = Platform.OS === 'web' ? webStorage : secureStorage;
