import { prisma } from "@lib/prisma";
import { recommendedPackages } from "../lib/recommendedPackages";

export const getRecommendedPackages = (department: string) => {
  return recommendedPackages[department] || [];
};

interface OnboardingTask {
  name: string;
  completed: boolean;
}

interface OnboardingInput {
  angajatId?: string;
  laptopId: string;
  department: string;
  tasks: OnboardingTask[];
}

export const createOnboarding = (data: OnboardingInput) => {
  return prisma.onboarding.create({ data });
};
