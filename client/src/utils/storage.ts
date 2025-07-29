import type { User } from "@/types/user"

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function getUser(): User | null {
  const raw = localStorage.getItem("user")
  return raw ? (JSON.parse(raw) as User) : null
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearStorage(): void {
  localStorage.clear();
}