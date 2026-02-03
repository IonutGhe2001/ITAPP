import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import type { Angajat, Echipament } from '@/features/equipment/types';

export interface PaginatedAngajatiResponse {
  data: AngajatWithRelations[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

export interface GetAngajatiParams {
  pageSize?: number;
  department?: string;
  includeInactive?: boolean;
}

const DEFAULT_QUERY_PARAMS: GetAngajatiParams = Object.freeze({});

interface UseAngajatiOptions {
  enabled?: boolean;
}

export interface AngajatWithRelations extends Angajat {
  departmentConfigId?: string | null;
  dataAngajare?: string;
  echipamente: Echipament[];
  checklist?: string[];
  licenses?: string[];
  isActive?: boolean;
  archivedAt?: string | null;
  archivedBy?: string | null;
}

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

export const getAngajati = (params: GetAngajatiParams & { page?: number } = {}) =>
  http.get<PaginatedAngajatiResponse>('/angajati', {
    params,
  });

export const getAllAngajati = () => http.get<AngajatWithRelations[]>(`/angajati/full`);

export const useAngajati = (params?: GetAngajatiParams, options: UseAngajatiOptions = {}) => {
  const queryParams = params ?? DEFAULT_QUERY_PARAMS;

  return useInfiniteQuery<PaginatedAngajatiResponse, Error>({
    queryKey: [...QUERY_KEYS.EMPLOYEES, queryParams],
    initialPageParam: 1,
    enabled: options.enabled ?? true,
    queryFn: ({ pageParam = 1 }) =>
      http.get<PaginatedAngajatiResponse>('/angajati', {
        params: { ...queryParams, page: pageParam },
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
};

export const useAllAngajati = () =>
  useQuery<AngajatWithRelations[]>({
    queryKey: [...QUERY_KEYS.EMPLOYEES, 'full'],
    queryFn: () => http.get<AngajatWithRelations[]>('/angajati/full'),
  });

export const useCreateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AngajatInput) => http.post<Angajat>('/angajati', data),
    onSuccess: () => {
      // Reset infinite queries to avoid duplicates when loading more pages
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useUpdateAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AngajatUpdateInput }) =>
      http.put<Angajat>(`/angajati/${id}`, data),
    onSuccess: () => {
      // Reset infinite queries to avoid duplicates when loading more pages
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useDeleteAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => http.delete<void>(`/angajati/${id}`),
    onSuccess: () => {
      // Reset infinite queries to avoid duplicates when loading more pages
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
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
      // Reset infinite queries to avoid duplicates when loading more pages
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useArchiveAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => http.post<void>(`/angajati/${id}/archive`),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export const useUnarchiveAngajat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => http.post<void>(`/angajati/${id}/unarchive`),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: QUERY_KEYS.EMPLOYEES });
    },
  });
};

export type DocumentType =
  | 'PROCES_VERBAL'
  | 'CONTRACT_ANGAJARE'
  | 'CONTRACT_MUNCA'
  | 'CERTIFICAT'
  | 'DIPLOMA'
  | 'EVALUARE'
  | 'AVERTISMENT'
  | 'DECIZIE'
  | 'CERERE'
  | 'ALTA_CORESPONDENTA'
  | 'OTHER';

export interface SearchDocumentsParams {
  employeeName?: string;
  documentType?: DocumentType;
  uploadYear?: number;
  includeInactive?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ArchiveDocument {
  id: string;
  name: string;
  path: string;
  type?: string;
  size?: number;
  documentType: DocumentType;
  uploadYear: number;
  createdAt: string;
  uploadedBy?: string;
  angajat: {
    id: string;
    numeComplet: string;
    functie: string;
    isActive: boolean;
    archivedAt?: string | null;
  };
}

export interface SearchDocumentsResponse {
  data: ArchiveDocument[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const searchArchiveDocuments = (params: SearchDocumentsParams) =>
  http.get<SearchDocumentsResponse>('/angajati/archive/search', { params });

export const useSearchArchiveDocuments = (params: SearchDocumentsParams) =>
  useQuery<SearchDocumentsResponse>({
    queryKey: ['archive-documents', params],
    queryFn: () => searchArchiveDocuments(params),
  });
