import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import api from './api';
import type { Echipament, Angajat } from '@/features/equipment/types';

export interface GlobalSearchData {
  echipamente: Echipament[];
  angajati: Angajat[];
  suggestions?: {
    echipamente: Echipament[];
    angajati: Angajat[];
  };
}

export const useGlobalSearch = (query: string) =>
  useQuery<GlobalSearchData>({
    queryKey: [...QUERY_KEYS.GLOBAL_SEARCH, query],
    queryFn: async () => (await api.get('/search', { params: { q: query } })).data,
    enabled: !!query.trim(),
  });

export interface SuggestionsData {
  echipamente: Echipament[];
  angajati: Angajat[];
}

export const useSearchSuggestions = (query: string) =>
  useQuery<SuggestionsData>({
    queryKey: [...QUERY_KEYS.SEARCH_SUGGESTIONS, query],
    queryFn: async () => (await api.get('/search/suggestions', { params: { q: query } })).data,
    enabled: !!query.trim(),
  });
