import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import { getEchipamenteCache, setEchipamenteCache } from '@/utils/storage';
import type { Echipament, EchipamentInput, EchipamentUpdateInput } from './types';

export const useEchipamente = () => {
  const query = useQuery<Echipament[], Error, Echipament[], typeof QUERY_KEYS.EQUIPMENT>({
    queryKey: QUERY_KEYS.EQUIPMENT,
    queryFn: () => http.get<Echipament[]>('/echipamente'),
    initialData: getEchipamenteCache() ?? [],
  });

  useEffect(() => {
    if (query.data) {
      setEchipamenteCache(query.data);
    }
  }, [query.data]);

  return query;
};

export const useEchipament = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery<Echipament, Error>({
    queryKey: [...QUERY_KEYS.EQUIPMENT, id],
    queryFn: () => http.get<Echipament>(`/echipamente/${id}`),
    enabled: !!id,
    initialData: () => {
      const list = queryClient.getQueryData<Echipament[]>(QUERY_KEYS.EQUIPMENT);
      return list?.find((e) => e.id === id);
    },
  });
};

export const useCreateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EchipamentInput) => http.post<Echipament>('/echipamente', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};

export const useUpdateEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EchipamentUpdateInput }) =>
      http.put<Echipament>(`/echipamente/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};

export const useDeleteEchipament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => http.delete<void>(`/echipamente/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EQUIPMENT });
    },
  });
};
