import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

// 백엔드 연동 전까지 로그인 성공을 재현하기 위한 목업 테스트 계정.
const MOCK_TEST_EMAIL = 'test@test.com';
const MOCK_TEST_PASSWORD = '1234';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', request);
    return data;
  }
  
  if (
    request.email.trim().toLowerCase() !== MOCK_TEST_EMAIL ||
    request.password !== MOCK_TEST_PASSWORD
  ) {
    await mockDelay(null);
    throw new Error('INVALID_CREDENTIALS');
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

export async function findId(name: string, birthDate: string, phone: string): Promise<FindIdResult> {
  const localPart = name.toLowerCase().replace(/\s/g, '') || 'user';
  return mockDelay({ maskedId: `${maskLeading(localPart, 3)}@mijunge.com`, joinedAt: '2025-11-02' });
}

function maskLeading(value: string, maxVisible: number): string {
  const visibleCount = Math.min(maxVisible, value.length);
  return `${value.slice(0, visibleCount)}${'*'.repeat(value.length - visibleCount)}`;
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
