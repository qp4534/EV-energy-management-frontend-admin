import { apiClient, mockDelay, USE_MOCK } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import { FindIdResult, LoginRequest, LoginResponse, SignupInfoRequest, User } from '@/types/auth';

// 백엔드 연동 전까지 로그인 성공을 재현하기 위한 목업 테스트 계정.
const MOCK_TEST_EMAIL = 'test@test.com';
const MOCK_TEST_PASSWORD = '1234';

// 이 앱은 차량 소유주 전용 앱이라 회원가입/아이디찾기 시 백엔드에 항상 이 role로 보낸다.
// 백엔드 UserEntity.role은 자유 문자열이며 "관리자"만 특별 취급되고 나머지는 일반 권한으로 처리된다.
const USER_ROLE = '차주';

type BackendMeResponse = {
  userId: string;
  email: string;
  name: string;
};

type BackendMeDetail = BackendMeResponse & {
  phone: string | null;
  pushEnabled: boolean | null;
};

type ProfileUpdatePayload = {
  name?: string;
  phone?: string;
  pushEnabled?: boolean;
  currentPassword?: string;
  newPassword?: string;
};

function toUserWithPhone(dto: BackendMeDetail): User {
  return {
    id: dto.userId,
    name: dto.name,
    email: dto.email,
    phone: dto.phone ?? undefined,
    pushEnabled: dto.pushEnabled ?? undefined,
  };
}

type BackendLoginResponse = {
  token: string;
  role: string;
  userId: string;
  name: string;
};

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<BackendLoginResponse>('/api/auth/login', request);
    // 백엔드 응답에는 email이 없어서, 사용자가 입력한 값을 그대로 사용한다.
    return { token: data.token, user: { id: data.userId, name: data.name, email: request.email } };
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
    const { data } = await apiClient.post<BackendMeResponse>('/api/auth/signup', {
      email: request.email,
      password: request.password,
      name: request.name,
      phone: request.phone,
      birth: request.birthDate,
      role: USER_ROLE,
      consentedTerms: request.consentedTerms,
    });
    return { id: data.userId, name: data.name, email: data.email };
  }
  return mockDelay({ id: 'u1', name: request.name, email: request.email });
}

export async function requestVerificationCode(email: string): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    await apiClient.post('/api/auth/email/send-code', { email });
    return { success: true };
  }
  return mockDelay({ success: true });
}

export async function confirmVerificationCode(
  email: string,
  code: string
): Promise<{ verified: boolean }> {
  if (!USE_MOCK) {
    await apiClient.post('/api/auth/email/verify-code', { email, code });
    return { verified: true };
  }
  return mockDelay({ verified: true });
}

// 비밀번호 재설정용 인증코드 발송. 회원가입용 send-code는 "미가입 이메일"만 허용하므로
// 이미 가입된 계정의 비밀번호 재설정에는 별도 엔드포인트를 써야 한다.
export async function requestPasswordResetCode(email: string): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    await apiClient.post('/api/auth/password/reset/send-code', { email });
    return { success: true };
  }
  return mockDelay({ success: true });
}

export async function findId(name: string, birthDate: string, phone: string): Promise<FindIdResult> {
  if (!USE_MOCK) {
    const { data } = await apiClient.post<{ name: string; email: string }>('/api/auth/find-email', {
      name,
      phone,
      birth: birthDate,
      role: USER_ROLE,
    });
    return { maskedId: maskEmail(data.email) };
  }

  const localPart = name.toLowerCase().replace(/\s/g, '') || 'user';
  return mockDelay({ maskedId: `${maskLeading(localPart, 3)}@mijunge.com`, joinedAt: '2025-11-02' });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${maskLeading(local, 3)}@${domain}`;
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
    await apiClient.post('/api/auth/password/reset', { email, newPassword });
    return { success: true };
  }
  return mockDelay({ success: true });
}

export async function getMe(): Promise<User> {
  if (!USE_MOCK) {
    const { data } = await apiClient.get<BackendMeDetail>('/api/auth/me');
    return toUserWithPhone(data);
  }
  const current = useAuthStore.getState().user;
  return mockDelay({
    id: current?.id ?? 'u1',
    name: current?.name ?? '홍길동',
    email: current?.email ?? 'test@test.com',
    phone: current?.phone ?? '010-1234-5678',
    pushEnabled: current?.pushEnabled ?? true,
  });
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<User> {
  if (!USE_MOCK) {
    const { data } = await apiClient.patch<BackendMeDetail>('/api/auth/me', payload);
    return toUserWithPhone(data);
  }
  const current = useAuthStore.getState().user;
  return mockDelay({
    id: current?.id ?? 'u1',
    name: payload.name ?? current?.name ?? '홍길동',
    email: current?.email ?? 'test@test.com',
    phone: payload.phone ?? current?.phone ?? '010-1234-5678',
    pushEnabled: payload.pushEnabled ?? current?.pushEnabled ?? true,
  });
}

// DELETE/POST 요청 모두 axios 인터셉터가 Authorization 헤더를 자동으로 붙여준다.
export async function deleteAccount(currentPassword: string): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.delete('/api/auth/me', { data: { currentPassword } });
    return;
  }
  await mockDelay(undefined);
}

export async function logout(): Promise<void> {
  if (!USE_MOCK) {
    await apiClient.post('/api/auth/logout');
    return;
  }
  await mockDelay(undefined);
}
