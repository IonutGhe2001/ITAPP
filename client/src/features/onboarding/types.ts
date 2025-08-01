export interface OnboardingTask {
  name: string;
  completed: boolean;
}

export interface OnboardingInput {
  angajatId?: string;
  laptopId: string;
  department: string;
  tasks: OnboardingTask[];
}