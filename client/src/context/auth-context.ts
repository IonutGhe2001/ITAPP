import { createContext } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  loading: boolean
  login: (token: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
export type { AuthContextType }