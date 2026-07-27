import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/auth-store';

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return <Redirect href={isLoggedIn ? '/home' : '/login'} />;
}
