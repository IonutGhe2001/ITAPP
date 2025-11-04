import http from '@/services/http';

export type OverviewStatsResponse = {
  total: number;
  in_stock: number;
  allocated: number;
  repair_retired: number;
  deltas: {
    total: number;
    in_stock: number;
    allocated: number;
    repair_retired: number;
  };
};

export type EquipmentStatusRecord = {
  status: string;
  in_stock: number;
  allocated: number;
  repair: number;
  retired: number;
};

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
};

export type PvQueueItem = {
  id: string;
  employee: string;
  equipment: string;
  allocationDate: string;
  location: string;
  status: 'pending' | 'overdue';
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
};

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
  location?: string;
  description?: string;
};

export type CalendarEventInput = Omit<CalendarEvent, 'id'>;

export async function getOverviewStats(): Promise<OverviewStatsResponse> {
  const stats = await http.get<{
    echipamente: number;
    in_stoc: number;
    alocat: number;
    mentenanta: number;
    in_comanda: number;
    angajati: number;
  }>('/echipamente/stats');

  // Calculate totals and deltas (for now, use 0 for deltas as we don't have historical data)
  return {
    total: stats.echipamente,
    in_stock: stats.in_stoc,
    allocated: stats.alocat,
    repair_retired: stats.mentenanta + stats.in_comanda,
    deltas: {
      total: 0,
      in_stock: 0,
      allocated: 0,
      repair_retired: 0,
    },
  };
}

export async function getEquipmentStatus(): Promise<EquipmentStatusRecord[]> {
  // This endpoint doesn't exist yet in the backend, so we'll return empty array for now
  // TODO: Implement this endpoint in the backend
  return [];
}

export async function getAlerts(_limit = 3): Promise<Alert[]> {
  // This endpoint doesn't exist yet in the backend, so we'll return empty array for now
  // TODO: Implement this endpoint in the backend
  return [];
}

export async function getPvQueue(_limit = 10): Promise<PvQueueItem[]> {
  // This endpoint doesn't exist yet in the backend, so we'll return empty array for now
  // TODO: Implement this endpoint in the backend
  return [];
}

export async function getActivity(_limit = 10): Promise<ActivityItem[]> {
  // This endpoint doesn't exist yet in the backend, so we'll return empty array for now
  // TODO: Implement this endpoint in the backend
  return [];
}

export async function getEvents(params?: { from?: string; to?: string }): Promise<CalendarEvent[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.from) queryParams.append('from', params.from);
    if (params?.to) queryParams.append('to', params.to);
    
    const response = await http.get<CalendarEvent[]>(`/evenimente?${queryParams.toString()}`);
    return response;
  } catch (error) {
    // If endpoint doesn't exist or fails, return empty array
    console.error('Failed to fetch events:', error);
    return [];
  }
}

export async function createEvent(payload: CalendarEventInput): Promise<CalendarEvent> {
  return http.post<CalendarEvent>('/evenimente', payload);
}

export async function updateEvent(id: string, payload: CalendarEventInput): Promise<CalendarEvent> {
  return http.put<CalendarEvent>(`/evenimente/${id}`, payload);
}

export async function deleteEvent(id: string): Promise<void> {
  await http.delete(`/evenimente/${id}`);
}