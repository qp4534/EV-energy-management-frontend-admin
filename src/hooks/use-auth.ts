import axios from 'axios';

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
      // 백엔드가 실제로 내려준 이유로만 판단한다 - 예전엔 여기서 에러 종류를 안 가리고
      // 무조건 "비밀번호 틀림"으로 취급해서, 네트워크 오류나 서버 에러가 나도 화면엔
      // "이메일 또는 비밀번호가 올바르지 않습니다"라고만 떠서 진짜 원인을 알 수 없었다.
      const code = axios.isAxiosError(error) ? error.response?.data?.error : null;

      if (code === 'ACCOUNT_LOCKED') {
        throw new AccountLockedError();
      }
      if (code === 'INVALID_CREDENTIALS') {
        const { attempts, locked } = recordFailure(request.email);
        if (locked) {
          throw new AccountLockedError();
        }
        throw new InvalidCredentialsError(MAX_LOGIN_ATTEMPTS - attempts);
      }
      // ACCOUNT_DELETED, 네트워크 오류, 서버 오류(500) 등 - 그대로 올려서 화면엔
      // 일반 에러 메시지("로그인에 실패했습니다...")로 표시되게 한다.
      throw error;
    }
  };

  return { token, user, isLoggedIn, isHydrated, login: loginWithCredentials, logout };
}
