import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import type { OnboardingInput } from "./types";

export const useOnboardingPackages = (department?: string) =>
  useQuery<string[]>({
    queryKey: ["onboarding-packages", department],
    queryFn: async () =>
      (await api.get(`/onboarding/packages/${department}`)).data as string[],
    enabled: !!department,
  });

export const useSaveOnboarding = () =>
  useMutation({
    mutationFn: (data: OnboardingInput) => api.post("/onboarding", data),
  });