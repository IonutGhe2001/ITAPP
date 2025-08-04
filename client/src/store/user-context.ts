import { createContext } from 'react';
import type { User } from '@/types/user';

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
