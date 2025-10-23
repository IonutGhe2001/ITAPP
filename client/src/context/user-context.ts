import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { User } from '@/types/user';

type UserContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  refreshUser: () => Promise<User | null>;
  loading: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);
export type { UserContextType };