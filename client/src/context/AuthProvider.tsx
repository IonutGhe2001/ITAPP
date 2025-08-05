import { useEffect, useState, type ReactNode } from 'react';
import { logout as logoutRequest } from '@/services/authService';
import { getToken, setToken as storeToken, removeToken } from '@/utils/storage';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loggedInViaCookie, setLoggedInViaCookie] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (newToken: string) => {
    storeToken(newToken);
    setTokenState(newToken);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // ignore errors
    }
    removeToken();
    setTokenState(null);
    setLoggedInViaCookie(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    const stored = getToken();
    fetch(import.meta.env.VITE_API_URL + '/auth/me', {
      credentials: 'include',
      headers: stored ? { Authorization: `Bearer ${stored}` } : undefined,
      signal: controller.signal,
    })
      .then((res) => {
        if (res.ok) {
          if (!stored) {
            // session valid via cookie
            setLoggedInViaCookie(true);
          }
        } else {
          removeToken();
          setTokenState(null);
          setLoggedInViaCookie(false);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          removeToken();
          setTokenState(null);
          setLoggedInViaCookie(false);
        }
      })
      .finally(() => setLoading(false));

      return () => {
      controller.abort();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token || loggedInViaCookie,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
