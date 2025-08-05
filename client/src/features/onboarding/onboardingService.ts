import { useQuery, useMutation } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import http from '@/services/http';
import type { OnboardingInput } from './types';

export const useOnboardingPackages = (department?: string) =>
  useQuery<string[]>({
    queryKey: [...QUERY_KEYS.ONBOARDING_PACKAGES, department],
    queryFn: () => http.get<string[]>(`/onboarding/packages/${department}`),
    enabled: !!department,
  });

export const useSaveOnboarding = () =>
  useMutation({
    mutationFn: (data: OnboardingInput) => http.post<void>('/onboarding', data),
  });
