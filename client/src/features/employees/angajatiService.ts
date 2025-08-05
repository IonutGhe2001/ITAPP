import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import type { Angajat } from '@/features/equipment/types';

export interface AngajatInput {
  numeComplet: string;
  functie: string;
  email?: string;
  telefon?: string;
  departmentConfigId?: string;
  dataAngajare?: Date;
  cDataUsername?: string;
  cDataId?: string;
  cDataNotes?: string;
  cDataCreated?: boolean;
}

export interface AngajatUpdateInput {
  numeComplet?: string;
  functie?: string;
  email?: string;
  telefon?: string;
  departmentConfigId?: string;
  dataAngajare?: Date;
  cDataUsername?: string;
  cDataId?: string;
  cDataNotes?: string;
  cDataCreated?: boolean;
}

export const getAngajat = (id: string) => http.get<Angajat>(`/angajati/${id}`);

export const getAngajati = () => http.get<Angajat[]>(`/angajati`);

export const useAngajati = () =>
  useQuery<Angajat[]>({
    queryKey: QUERY_KEYS.EMPLOYEES,
    queryFn: () => http.get<Angajat[]>('/angajati'),
  });

export const useCreateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AngajatInput) => http.post<Angajat>('/angajati', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useUpdateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AngajatUpdateInput }) =>
      http.put<Angajat>(`/angajati/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useDeleteAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => http.delete<void>(`/angajati/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useCreateEmailAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      email,
      responsible,
      link,
    }: {
      id: string;
      email: string;
      responsible: string;
      link?: string;
    }) =>
      http.post<void>(`/angajati/${id}/email-account`, {
        email,
        responsible,
        link,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};
