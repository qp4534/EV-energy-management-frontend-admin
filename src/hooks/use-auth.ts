import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { MAX_LOGIN_ATTEMPTS, useLoginAttemptStore } from '@/store/login-attempt-store';
import { LoginRequest } from '@/types/auth';

export class AccountLockedError extends Error {
  constructor() {
    super('ACCOUNT_LOCKED');
  }
}

export class InvalidCredentialsError extends Error {
  attemptsRemaining: number;
  constructor(attemptsRemaining: number) {
    super('INVALID_CREDENTIALS');
    this.attemptsRemaining = attemptsRemaining;
  }
}

export function useAuth() {
  const { token, user, isLoggedIn, isHydrated, login, logout } = useAuthStore();
  const { recordFailure, resetAttempts, isLocked } = useLoginAttemptStore();

  const loginWithCredentials = async (request: LoginRequest) => {
    if (isLocked(request.email)) {
      throw new AccountLockedError();
    }

    try {
      const res = await authApi.login(request);
      resetAttempts(request.email);
      login(res.token, res.user);
    } catch (error) {
      const { attempts, locked } = recordFailure(request.email);
      if (locked) {
        throw new AccountLockedError();
      }
      throw new InvalidCredentialsError(MAX_LOGIN_ATTEMPTS - attempts);
    }
  };

  return { token, user, isLoggedIn, isHydrated, login: loginWithCredentials, logout };
}
