import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { logout as logoutRequest } from "@/services/authService";
import {
  getToken,
  setToken as storeToken,
  removeToken,
} from "@/utils/storage";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  const login = (newToken: string) => {
    storeToken(newToken);
    setTokenState(newToken);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (e) {
      // ignore errors
    }
    removeToken();
    setTokenState(null);
  };

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + "/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          login("logged-in");
        }
      })
      .catch(() => {
        removeToken();
        setTokenState(null);
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