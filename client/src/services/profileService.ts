import http from '@/services/http';

export type UserMetric = {
  label: string;
  value: string;
};

export type UserActivity = {
  title: string;
  time: string;
};

export type UserSession = {
  device: string;
  location: string;
  lastActive: string;
};

export async function getUserMetrics(): Promise<UserMetric[]> {
  return http.get<UserMetric[]>('/profile/metrics');
}

export async function getUserActivity(limit = 10): Promise<UserActivity[]> {
  return http.get<UserActivity[]>(`/profile/activity?limit=${limit}`);
}

export async function getUserSessions(): Promise<UserSession[]> {
  return http.get<UserSession[]>('/profile/sessions');
}
