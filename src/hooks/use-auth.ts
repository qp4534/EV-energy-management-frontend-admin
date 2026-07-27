import * as authApi from '@/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { LoginRequest } from '@/types/auth';

export function useAuth() {
  const { token, user, isLoggedIn, isHydrated, login, logout } = useAuthStore();

  const loginWithCredentials = async (request: LoginRequest) => {
    const res = await authApi.login(request);
    login(res.token, res.user);
  };

  return { token, user, isLoggedIn, isHydrated, login: loginWithCredentials, logout };
}
