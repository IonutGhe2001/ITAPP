import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';

export interface DepartmentConfigInput {
  name: string;
  defaultLicenses?: string[];
  defaultRequirements?: string[];
}

export interface DepartmentConfig extends DepartmentConfigInput {
  id: string;
}

export const getDepartmentConfigs = () =>
  http.get<DepartmentConfig[]>('/department-configs');


export const useDepartmentConfigs = () =>
  useQuery<DepartmentConfig[]>({
    queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS,
    queryFn: () => getDepartmentConfigs(),
  });

export const useCreateDepartmentConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentConfigInput) =>
      http.post<DepartmentConfig>('/department-configs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS });
    },
  });
};

export const useUpdateDepartmentConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentConfigInput }) =>
      http.put<DepartmentConfig>(`/department-configs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS });
    },
  });
};
