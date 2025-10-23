import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import api from '@/services/api';
import { getEchipamenteCache, setEchipamenteCache } from '@/utils/storage';
import type { Echipament, EchipamentInput, EchipamentUpdateInput } from './types';

const DEFAULT_PAGE_SIZE = 20;

export interface UseEchipamenteOptions {
  search?: string;
  status?: string;
  type?: string;
  sort?: 'asc' | 'desc';
  sortBy?: 'nume' | 'createdAt' | 'tip' | 'stare';
  pageSize?: number;
  autoFetchAll?: boolean;
  enabled?: boolean;
}

interface GetEchipamenteResponse {
  items: Echipament[];
  total: number;
}

const isDefaultQuery = (options: UseEchipamenteOptions) => {
  const hasFilters = Boolean(options.search || options.status || options.type);
  const hasCustomSort = (options.sort ?? 'asc') !== 'asc' || (options.sortBy ?? 'nume') !== 'nume';
  const hasCustomPageSize = (options.pageSize ?? DEFAULT_PAGE_SIZE) !== DEFAULT_PAGE_SIZE;

  return !hasFilters && !hasCustomSort && !hasCustomPageSize;
};

const buildQueryParams = (options: UseEchipamenteOptions, page: number) => ({
  page,
  pageSize: options.pageSize ?? DEFAULT_PAGE_SIZE,
  search: options.search || undefined,
  status: options.status || undefined,
  type: options.type || undefined,
  sort: options.sort ?? 'asc',
  sortBy: options.sortBy ?? 'nume',
});

export const useEchipamente = (options: UseEchipamenteOptions = {}) => {
  const {
    autoFetchAll = true,
    enabled = true,
    search,
    status,
    type,
    sort = 'asc',
    sortBy = 'nume',
  } = options;
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;

  const defaultQuery = isDefaultQuery(options);
  const cached = defaultQuery ? getEchipamenteCache() : undefined;

  const queryKey = [
    ...QUERY_KEYS.EQUIPMENT,
    { search: search || '', status: status || '', type: type || '', sort, sortBy, pageSize },
  ] as const;

  const query = useInfiniteQuery<GetEchipamenteResponse, Error>({
    queryKey,
    initialPageParam: 1,
    enabled,
    queryFn: ({ pageParam = 1 }) =>
      http.get<GetEchipamenteResponse>('/echipamente', {
        params: buildQueryParams(options, pageParam as number),
      }),
    getNextPageParam: (lastPage, pages) => {
      const totalFetched = pages.reduce((acc, page) => acc + page.items.length, 0);
      return totalFetched < lastPage.total ? pages.length + 1 : undefined;
    },
    initialData: () => {
      if (!defaultQuery || !cached || cached.length === 0) {
        return undefined;
      }
      return {
        pageParams: [1],
        pages: [{ items: cached, total: cached.length }],
      } as InfiniteData<GetEchipamenteResponse, number>;
    },
  });

  const {
    data: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...rest
  } = query;

  const items = useMemo<Echipament[]>(() => {
    if (paginatedData) {
      return paginatedData.pages.flatMap((page) => page.items);
    }
    if (defaultQuery && cached) {
      return cached;
    }
    return [];
  }, [paginatedData, defaultQuery, cached]);

  useEffect(() => {
    if (!defaultQuery || autoFetchAll === false || items.length === 0) {
      return;
    }
  setEchipamenteCache(items);
  }, [items, defaultQuery, autoFetchAll]);

  useEffect(() => {
    if (!autoFetchAll || !enabled) return;
    if (!paginatedData || paginatedData.pages.length === 0) return;
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [autoFetchAll, enabled, paginatedData, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const total = paginatedData?.pages[0]?.total ?? (defaultQuery && cached ? cached.length : 0);

  return {
    ...rest,
    data: items,
    total,
    pages: paginatedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useEchipament = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery<Echipament, Error>({
    queryKey: [...QUERY_KEYS.EQUIPMENT, id],
    queryFn: () => http.get<Echipament>(`/echipamente/${id}`),
    enabled: !!id,
    initialData: () => {
      const data = queryClient.getQueriesData<InfiniteData<GetEchipamenteResponse>>({
        queryKey: QUERY_KEYS.EQUIPMENT,
      });

      for (const [, value] of data) {
        const match = value?.pages.flatMap((page) => page.items).find((item) => item.id === id);
        if (match) {
          return match;
        }
      }

      const cachedItems = getEchipamenteCache();
      return cachedItems?.find((item) => item.id === id);
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

export const exportEchipamente = async () => {
  const res = await api.get('/echipamente/export', { responseType: 'blob' });
  const url = window.URL.createObjectURL(res.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'echipamente.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
};
