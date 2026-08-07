import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', request);
    return data;
  }
  return mockDelay({
    token: 'mock-token',
    user: { id: 'u1', name: '홍길동', email: request.email },
  });
}

export async function signupInfo(request: SignupInfoRequest): Promise<User> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<User>('/auth/signup', request);
    return data;
  }
  return mockDelay({ id: 'u1', name: request.name, email: request.email });
}

export async function requestVerificationCode(email: string): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<{ success: boolean }>('/auth/email/verification-code', {
      email,
    });
    return data;
  }
  return mockDelay({ success: true });
}

export async function confirmVerificationCode(
  email: string,
  code: string
): Promise<{ verified: boolean }> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<{ verified: boolean }>(
      '/auth/email/verification-code/confirm',
      { email, code }
    );
    return data;
  }
  return mockDelay({ verified: true });
}

export async function findId(name: string, email: string): Promise<FindIdResult> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<FindIdResult>('/auth/find-id', { name, email });
    return data;
  }
  const [localPart, domain] = email.split('@');
  const maskedLocal = `${localPart.slice(0, 2)}${'*'.repeat(Math.max(localPart.length - 2, 0))}`;
  return mockDelay({ maskedId: `${maskedLocal}@${domain}`, joinedAt: '2025-11-02' });
}

export async function resetPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<{ success: boolean }>('/auth/reset-password', {
      email,
      newPassword,
    });
    return data;
  }
  return mockDelay({ success: true });
}
