import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { logout as logoutRequest } from "@/services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      // ignore errors
    }
    setToken(null);
  };

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setToken("logged-in");
        }
      })
      .catch(() => {
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};