import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/authService";
import { getUser, setUser as setUserStorage } from "@/utils/storage"; 

export type User = {
  nume: string;
  prenume: string;
  functie: string;
  profilePicture?: string;
  email?: string;
  telefon?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};