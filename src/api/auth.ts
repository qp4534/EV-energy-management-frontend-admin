import { mockDelay } from '@/api/client';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

export async function login(request: LoginRequest): Promise<LoginResponse> {
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
