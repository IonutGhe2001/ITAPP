import http from './http';
import type { User } from '@/types/user';

export const login = (email: string, password: string) =>
  http.post<void>('/auth/login', { email, password });

export const getCurrentUser = async () => {
  try {
    return await http.get<User>('/auth/me');
  } catch (error) {
    console.error('Eroare la /me:', error);
    return null;
  }
};

export const updateCurrentUser = async (
  data: Partial<{
    nume: string;
    prenume: string;
    functie: string;
    telefon?: string;
    departament?: string | null;
    locatie?: string | null;
    profilePicture?: string | null;
    digitalSignature?: string | null;
  }>
) => {
  return await http.patch<User>('/auth/me', data);
};

export const logout = () => http.post<void>('/auth/logout');
