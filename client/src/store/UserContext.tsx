import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/services/authService';
import { getUser, setUser as setUserStorage } from '@/utils/storage';
import type { User } from '@/types/user';
import { UserContext } from './user-context';

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUser());

  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const data = await getCurrentUser();
    setUser(data);
    setUserStorage(data);
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
