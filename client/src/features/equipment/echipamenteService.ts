import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/constants/queryKeys';
import api from '@/services/api';
import { getEchipamenteCache, setEchipamenteCache } from '@/utils/storage';
import type { Echipament, EchipamentInput, EchipamentUpdateInput } from './types';

export const useEchipamente = () => {
  const query = useQuery<
    Echipament[],
    Error,
    Echipament[],
    typeof QUERY_KEYS.EQUIPMENT
  >({
    queryKey: QUERY_KEYS.EQUIPMENT,
    queryFn: async () => (await api.get('/echipamente')).data as Echipament[],
    initialData: getEchipamenteCache() ?? [],
  });

  useEffect(() => {
    if (query.data) {
      setEchipamenteCache(query.data);
    }
  }, [query.data]);

  return query;
};

export const useCreateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EchipamentInput) => api.post('/echipamente', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};

export const useUpdateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EchipamentUpdateInput }) =>
      api.put(`/echipamente/${id}`, data).then((r) => r.data as Echipament),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};

export const useDeleteEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/echipamente/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};
