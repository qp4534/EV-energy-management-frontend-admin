import { apiClient, mockDelay } from '@/api/client';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

// EV-energy-management-backend AuthController#login. 응답(LoginResponse.java)엔 email이
// 없어서(token/role/userId/name만 줌) 요청에 쓴 이메일을 그대로 돌려준다.
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post('/api/auth/login', request);
  return {
    token: data.token,
    user: { id: data.userId, name: data.name, email: request.email },
  };
}

export async function signupInfo(request: SignupInfoRequest): Promise<User> {
  return mockDelay({ id: 'u1', name: request.name, email: request.email });
}

// AuthController#sendEmailCode. 성공하면 204(본문 없음) - 실패(이미 가입된 이메일 등)는
// apiClient 인터셉터를 그대로 통과해서 호출부(catch)로 던져진다.
export async function requestVerificationCode(email: string): Promise<{ success: boolean }> {
  await apiClient.post('/api/auth/email/send-code', { email });
  return { success: true };
}

// AuthController#verifyEmailCode. 코드가 틀리면 400(INVALID_VERIFICATION_CODE)이 던져진다.
export async function confirmVerificationCode(
  email: string,
  code: string
): Promise<{ verified: boolean }> {
  await apiClient.post('/api/auth/email/verify-code', { email, code });
  return { verified: true };
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
  return mockDelay({ success: true });
}
