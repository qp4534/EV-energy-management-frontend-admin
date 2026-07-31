import { mockDelay } from '@/api/client';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

// 백엔드 연동 전까지 로그인 성공을 재현하기 위한 목업 테스트 계정.
const MOCK_TEST_EMAIL = 'test@test.com';
const MOCK_TEST_PASSWORD = '1234';

export async function login(request: LoginRequest): Promise<LoginResponse> {
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
  return mockDelay({ id: 'u1', name: request.name, email: request.email });
}

export async function requestVerificationCode(email: string): Promise<{ success: boolean }> {
  return mockDelay({ success: true });
}

export async function confirmVerificationCode(
  email: string,
  code: string
): Promise<{ verified: boolean }> {
  return mockDelay({ verified: true });
}

export async function findId(name: string, email: string): Promise<FindIdResult> {
  const [localPart, domain] = email.split('@');
  const maskedLocal = `${localPart.slice(0, 2)}${'*'.repeat(Math.max(localPart.length - 2, 0))}`;
  return mockDelay({ maskedId: `${maskedLocal}@${domain}`, joinedAt: '2025-11-02' });
}

export async function resetPassword(
  email: string,
  newPassword: string
): Promise<{ success: boolean }> {
  return mockDelay({ success: true });
}
