import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import api from '@/services/api';

export interface DepartmentConfigInput {
  name: string;
  defaultLicenses?: string[];
  defaultRequirements?: string[];
}

export const getDepartmentConfigs = () => api.get('/department-configs');

export const useDepartmentConfigs = () =>
  useQuery({
    queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS,
    queryFn: async () => (await getDepartmentConfigs()).data,
  });

export const useCreateDepartmentConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DepartmentConfigInput) => api.post('/department-configs', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS });
    },
  });
};

export const useUpdateDepartmentConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DepartmentConfigInput }) =>
      api.put(`/department-configs/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENT_CONFIGS });
    },
  });
};
