import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser } from '@/services/authService';
import { getUser, setUser as setUserStorage } from '@/utils/storage';
import type { User } from '@/types/user';
import { UserContext } from './user-context';
import { useAuth } from './useAuth';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUser());

  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loading: authLoading } = useAuth();

  const refreshUser = useCallback(async () => {
    const data = await getCurrentUser();
    setUser(data);
    setUserStorage(data);
    return data;
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      setLoading(true);
      refreshUser().finally(() => setLoading(false));
    } else {
      setUser(null);
      setUserStorage(null);
      setLoading(false);
    }
  }, [authLoading, isAuthenticated, refreshUser]);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
