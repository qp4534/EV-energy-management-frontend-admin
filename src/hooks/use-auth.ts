import { isAxiosError } from 'axios';

import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { LoginRequest } from '@/types/auth';
import { getErrorMessage } from '@/utils/error-message';

// 계정 잠금은 백엔드가 실제로 판단한다(USER.is_locked, 5회 실패 시). 프론트는 더 이상 자체적으로
// 시도 횟수를 세지 않는다 - 로컬(브라우저별) 카운터는 다른 기기의 시도를 모르고 localStorage만
// 지우면 무력화돼서 보안 효과가 없었고, 백엔드의 실제 잠금 상태와도 따로 놀았다.
export class AccountLockedError extends Error {}

export function useAuth() {
  const { token, user, isLoggedIn, isHydrated, login, logout } = useAuthStore();

  const loginWithCredentials = async (request: LoginRequest) => {
    try {
      const res = await authApi.login(request);
      login(res.token, res.user);
    } catch (error) {
      if (error instanceof authApi.WrongRoleError) {
        // 서버 에러 메시지가 아니라 여기서 직접 만든 안내 문구라 그대로 다시 던진다.
        throw error;
      }
      const message = getErrorMessage(error, '이메일 또는 비밀번호가 올바르지 않습니다.');
      if (isAxiosError(error) && error.response?.data?.error === 'ACCOUNT_LOCKED') {
        throw new AccountLockedError(message);
      }
      throw new Error(message);
    }
  };

  return { token, user, isLoggedIn, isHydrated, login: loginWithCredentials, logout };
}
