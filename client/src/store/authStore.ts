import { create } from "zustand";
import { getToken, setToken, removeToken } from "@/utils/storage";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: getToken(),

  setToken: (token: string) => {
    setToken(token);
    set({ token });
  },

  logout: () => {
    removeToken();
    set({ token: null });
  },
}));