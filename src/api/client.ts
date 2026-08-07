import axios from 'axios';

import { useAuthStore } from '@/store/auth-store';

/** 'false'로 설정하면 목업 대신 EXPO_PUBLIC_API_URL로 실제 API를 호출한다. 기본값은 true(목업). */
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

/** 백엔드 연동 전까지 api/*.ts에서 사용하는 목업 지연 헬퍼. */
export function mockDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}
