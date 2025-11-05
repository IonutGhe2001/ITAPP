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
  return http.get<OverviewStatsResponse>('/dashboard/stats/overview');
}

export async function getEquipmentStatus(): Promise<EquipmentStatusRecord[]> {
  return http.get<EquipmentStatusRecord[]>('/dashboard/stats/equipment-status');
}

export async function getAlerts(limit = 3): Promise<Alert[]> {
  return http.get<Alert[]>(`/dashboard/alerts?limit=${limit}`);
}

export async function getPvQueue(limit = 10): Promise<PvQueueItem[]> {
  return http.get<PvQueueItem[]>(`/dashboard/pv-queue?limit=${limit}`);
}

export async function getActivity(limit = 10): Promise<ActivityItem[]> {
  return http.get<ActivityItem[]>(`/dashboard/activity?limit=${limit}`);
}

export async function getEvents(params?: { from?: string; to?: string }): Promise<CalendarEvent[]> {
  // Note: The events are stored in a different format in the backend
  // We need to transform them to match the CalendarEvent type
  const evenimente = await http.get<Array<{
    id: number;
    titlu: string;
    data: string;
    ora: string;
  }>>('/evenimente');

  // Filter by date range if provided
  let filtered = evenimente;
  if (params?.from || params?.to) {
    filtered = evenimente.filter((event) => {
      const eventDate = event.data.split('T')[0];
      if (params.from && eventDate < params.from) return false;
      if (params.to && eventDate > params.to) return false;
      return true;
    });
  }

  // Transform to CalendarEvent format
  return filtered.map((event) => ({
    id: String(event.id),
    date: event.data.split('T')[0],
    title: event.titlu,
    time: event.ora,
    location: undefined,
    description: undefined,
  }));
}

export async function createEvent(payload: CalendarEventInput): Promise<CalendarEvent> {
  const response = await http.post<{
    id: number;
    titlu: string;
    data: string;
    ora: string;
  }>('/evenimente', {
    titlu: payload.title,
    data: payload.date,
    ora: payload.time || '',
    recurrence: 'none',
  });

  return {
    id: String(response.id),
    date: response.data.split('T')[0],
    title: response.titlu,
    time: response.ora,
    location: payload.location,
    description: payload.description,
  };
}

export async function updateEvent(id: string, payload: CalendarEventInput): Promise<CalendarEvent> {
  const response = await http.put<{
    id: number;
    titlu: string;
    data: string;
    ora: string;
  }>(`/evenimente/${id}`, {
    titlu: payload.title,
    data: payload.date,
    ora: payload.time || '',
  });

  return {
    id: String(response.id),
    date: response.data.split('T')[0],
    title: response.titlu,
    time: response.ora,
    location: payload.location,
    description: payload.description,
  };
}

export async function deleteEvent(id: string): Promise<void> {
  await http.delete(`/evenimente/${id}`);
}