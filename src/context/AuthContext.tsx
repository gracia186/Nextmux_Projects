import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { authApi } from '../lib/endpoints';
import { apiErrorMessage } from '../lib/api';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('stamux_user');
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('stamux_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => {
        setUser(res.data);
        localStorage.setItem('stamux_user', JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem('stamux_token');
        localStorage.removeItem('stamux_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('stamux_token', res.data.token);
      localStorage.setItem('stamux_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      const message = apiErrorMessage(err, 'Identifiants incorrects.');
      setError(message);
      throw new Error(message);
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // pas grave — on nettoie côté client de toute façon
    }
    localStorage.removeItem('stamux_token');
    localStorage.removeItem('stamux_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un <AuthProvider>');
  return ctx;
}
