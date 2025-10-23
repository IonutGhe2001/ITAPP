import type { User } from '@/types/user';
import type { Echipament } from '@/features/equipment/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem('token');
  } catch (error) {
    console.error('Failed to read token from localStorage', error);
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('token', token);
  } catch (error) {
    console.error('Failed to write token to localStorage', error);
  }
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem('token');
  } catch (error) {
    console.error('Failed to remove token from localStorage', error);
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
}

export function setUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem('user', JSON.stringify(user));
    } else {
      window.localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Failed to write user to localStorage', error);
  }
}

export function getEchipamenteCache(): Echipament[] | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    const raw = window.localStorage.getItem('echipamenteCache');
    return raw ? (JSON.parse(raw) as Echipament[]) : undefined;
  } catch (error) {
    console.error('Failed to parse echipamente cache from localStorage', error);
    return undefined;
  }
}

export function setEchipamenteCache(data: Echipament[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('echipamenteCache', JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write echipamente cache to localStorage', error);
  }
}

export function clearStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage', error);
  }
}
