import axios from 'axios';

import { useAuthStore } from '@/store/auth-store';

/** 'false'로 설정하면 목업 대신 EXPO_PUBLIC_API_URL로 실제 API를 호출한다. 기본값은 true(목업). */
export const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.com',
  // 기본값은 무제한 대기라, 백엔드에 아예 연결이 안 되는 상황(에뮬레이터 IP 오설정 등)에서
  // 스피너도 없이 버튼만 영원히 로딩 상태로 멈추는 문제가 있었다 - 최소한 에러는 뜨게 제한한다.
  timeout: 15000,
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
