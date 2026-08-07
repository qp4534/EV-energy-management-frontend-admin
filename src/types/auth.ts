export type User = {
  id: string;
  name: string;
  email: string;
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
};

export type FindIdResult = {
  maskedId: string;
  joinedAt: string;
};
