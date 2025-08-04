import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

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

export const getAngajat = (id: string) => api.get(`/angajati/${id}`);

export const getAngajati = () => api.get('/angajati');

export const useAngajati = () =>
  useQuery({
    queryKey: ['angajati'],
    queryFn: async () => (await api.get('/angajati')).data,
  });

export const useCreateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AngajatInput) => api.post('/angajati', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['angajati'] });
    },
  });
};

export const useUpdateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AngajatUpdateInput }) =>
      api.put(`/angajati/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['angajati'] });
    },
  });
};

export const useDeleteAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/angajati/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['angajati'] });
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
    }) => api.post(`/angajati/${id}/email-account`, { email, responsible, link }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['angajati'] });
    },
  });
};
