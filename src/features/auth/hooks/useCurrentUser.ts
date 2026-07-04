import { useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../store/authStore';

export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    authApi
      .me()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [setUser, setLoading]);
}