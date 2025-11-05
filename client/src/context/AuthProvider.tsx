import { useEffect, useState, type ReactNode } from 'react';
import { logout as logoutRequest, getCurrentUser } from '@/services/authService';
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
    const checkAuth = async () => {
      const stored = getToken();
      try {
        const user = await getCurrentUser();
        if (user) {
          if (!stored) {
            // session valid via cookie
            setLoggedInViaCookie(true);
          }
          setTokenState(stored);
        } else {
          removeToken();
          setTokenState(null);
          setLoggedInViaCookie(false);
        }
      } catch {
        removeToken();
        setTokenState(null);
        setLoggedInViaCookie(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
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
