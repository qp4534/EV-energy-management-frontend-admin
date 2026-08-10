export type User = {
  id: string;
  name: string;
  email: string;
  /** 로그인 응답엔 없고 /api/auth/me 조회 시에만 채워진다. */
  phone?: string;
  pushEnabled?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type SignupInfoRequest = {
  name: string;
  email: string;
  password: string;
  birthDate: string;
  phone: string;
  consentedTerms: string[];
};

export type FindIdResult = {
  maskedId: string;
  /** 백엔드 응답에 가입일이 없어 실제 조회 결과에는 없다. mock에서만 채워진다. */
  joinedAt?: string;
};
