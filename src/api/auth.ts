import { mockDelay } from '@/api/client';
import { LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return mockDelay({
    token: 'mock-token',
    user: { id: 'u1', name: '홍길동', email: request.email },
  });
}

export async function signupInfo(request: SignupInfoRequest): Promise<User> {
  return mockDelay({ id: 'u1', name: request.name, email: request.email });
}

export async function findId(email: string): Promise<{ id: string }> {
  return mockDelay({ id: email.split('@')[0] });
}

export async function resetPassword(email: string): Promise<{ success: boolean }> {
  return mockDelay({ success: true });
}
