import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';

// Tipuri de bază
export type EvenimentData = {
  titlu: string;
  ora: string | null;
  data: Date;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
};

export type Eveniment = EvenimentData & {
  id: number;
};

// 🔍 Obține toate evenimentele
export const fetchEvenimente = (): Promise<Eveniment[]> => {
  return http.get<Eveniment[]>('/evenimente');
};

// ➕ Creează un nou eveniment
export const createEveniment = (data: EvenimentData): Promise<Eveniment> => {
  return http.post<Eveniment>('/evenimente', data);
};

// 📝 Actualizează un eveniment existent
export const updateEveniment = (
  id: number,
  data: EvenimentData
): Promise<Eveniment> => {
  return http.patch<Eveniment>(`/evenimente/${id}`, data);
};

// ❌ Șterge un eveniment
export const deleteEveniment = (id: number): Promise<void> => {
  return http.delete<void>(`/evenimente/${id}`);
};

// React Query hooks

export const useEvenimente = () =>
  useQuery<Eveniment[]>({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: fetchEvenimente,
  });

export const useCreateEveniment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EvenimentData) => createEveniment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useUpdateEveniment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: EvenimentData }) =>
      updateEveniment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useDeleteEveniment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEveniment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};
