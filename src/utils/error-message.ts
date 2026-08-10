import { isAxiosError } from 'axios';

/** 백엔드 ErrorResponse.message가 있으면 그대로 쓰고, 없으면 fallback을 반환한다. */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
}
