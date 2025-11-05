import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from './http';
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
    queryKey: [...QUERY_KEYS.GLOBAL_SEARCH, { q: query }],
    queryFn: () => http.get<GlobalSearchData>('/search', { params: { q: query } }),
    enabled: !!query.trim(),
  });

export interface SuggestionsData {
  echipamente: Echipament[];
  angajati: Angajat[];
}

export const useSearchSuggestions = (query: string) =>
  useQuery<SuggestionsData>({
    queryKey: [...QUERY_KEYS.SEARCH_SUGGESTIONS, query],
    queryFn: () => http.get<SuggestionsData>('/search/suggestions', { params: { q: query } }),
    enabled: !!query.trim(),
  });
