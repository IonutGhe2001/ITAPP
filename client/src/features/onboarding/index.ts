import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';

export interface OnboardingTask {
  name: string;
  completed: boolean;
}

export interface SaveOnboardingInput {
  department: string;
  laptopId: string;
  tasks: OnboardingTask[];
  angajatId?: string;
}

export const useOnboardingPackages = (department: string) =>
  useQuery<string[]>({
    queryKey: [...QUERY_KEYS.ONBOARDING_PACKAGES, department] as const,
    queryFn: () => http.get<string[]>(`/onboarding/packages/${encodeURIComponent(department)}`),
    enabled: Boolean(department),
    staleTime: 5 * 60_000,
  });

export const useSaveOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SaveOnboardingInput>({
    mutationFn: (payload) => http.post<void, SaveOnboardingInput>('/onboarding', payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.ONBOARDING_PACKAGES] });
      if (variables.department) {
        queryClient.invalidateQueries({
          queryKey: [...QUERY_KEYS.ONBOARDING_PACKAGES, variables.department] as const,
        });
      }
    },
  });
};