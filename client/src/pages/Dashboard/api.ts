import { addDays, formatISO, startOfMonth } from 'date-fns';

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

type MockEndpoint =
  | '/stats/overview'
  | '/stats/equipment-status'
  | '/alerts'
  | '/pv/queue'
  | '/activity'
  | '/events';

type MockDatabase = Record<MockEndpoint, unknown>;

const now = new Date();

const mockDatabase: MockDatabase = {
  '/stats/overview': {
    total: 428,
    in_stock: 196,
    allocated: 182,
    repair_retired: 50,
    deltas: {
      total: 4.5,
      in_stock: -2.1,
      allocated: 6.8,
      repair_retired: -1.4,
    },
  } satisfies OverviewStatsResponse,
  '/stats/equipment-status': [
    { status: 'Laptopuri', in_stock: 68, allocated: 54, repair: 6, retired: 4 },
    { status: 'Desktopuri', in_stock: 42, allocated: 31, repair: 8, retired: 6 },
    { status: 'Tablete', in_stock: 24, allocated: 18, repair: 3, retired: 2 },
    { status: 'Telefoane', in_stock: 36, allocated: 28, repair: 5, retired: 3 },
    { status: 'Periferice', in_stock: 26, allocated: 20, repair: 4, retired: 5 },
  ] satisfies EquipmentStatusRecord[],
  '/alerts': [
    {
      id: 'alert-1',
      title: 'Garanție expirată în 7 zile',
      description: 'Laptop Dell #A483 își încheie garanția în mai puțin de o săptămână.',
      severity: 'warning',
      timestamp: addDays(now, -1).toISOString(),
    },
    {
      id: 'alert-2',
      title: 'Echipament nealocat de 10 zile',
      description: 'Monitor LG #M204 este în depozit fără titular din 10 zile.',
      severity: 'info',
      timestamp: addDays(now, -2).toISOString(),
    },
    {
      id: 'alert-3',
      title: 'PV lipsă după alocare',
      description: 'Telefon iPhone 12 #T092 nu are PV generat după predare.',
      severity: 'critical',
      timestamp: addDays(now, -3).toISOString(),
    },
    {
      id: 'alert-4',
      title: 'Garanție expirată astăzi',
      description: 'Switch Cisco #S415 expiră astăzi, programează o revizie.',
      severity: 'critical',
      timestamp: addDays(now, -4).toISOString(),
    },
  ] satisfies Alert[],
  '/pv/queue': [
    {
      id: 'pv-1',
      employee: 'Ioana Popescu',
      equipment: 'Laptop Lenovo ThinkPad X1',
      allocationDate: addDays(now, -5).toISOString(),
      location: 'București - Sediu Central',
      status: 'pending',
    },
    {
      id: 'pv-2',
      employee: 'Radu Marinescu',
      equipment: 'Telefon Samsung S22',
      allocationDate: addDays(now, -9).toISOString(),
      location: 'Cluj - Hub Support',
      status: 'overdue',
    },
    {
      id: 'pv-3',
      employee: 'Laura Dima',
      equipment: 'Monitor LG UltraFine 27"',
      allocationDate: addDays(now, -2).toISOString(),
      location: 'Iași - Customer Care',
      status: 'pending',
    },
    {
      id: 'pv-4',
      employee: 'Mihai Preda',
      equipment: 'Lentile VR Oculus Quest',
      allocationDate: addDays(now, -12).toISOString(),
      location: 'Brașov - Laborator',
      status: 'overdue',
    },
  ] satisfies PvQueueItem[],
  '/activity': [
    {
      id: 'activity-1',
      actor: 'Alex Ionescu',
      action: 'a înregistrat',
      target: 'un nou laptop în inventar',
      timestamp: addDays(now, -0.3).toISOString(),
    },
    {
      id: 'activity-2',
      actor: 'Maria Călin',
      action: 'a actualizat',
      target: 'statutul unui router în reparație',
      timestamp: addDays(now, -1).toISOString(),
    },
    {
      id: 'activity-3',
      actor: 'Tudor Pavel',
      action: 'a generat',
      target: 'un PV pentru echipa de marketing',
      timestamp: addDays(now, -1.4).toISOString(),
    },
    {
      id: 'activity-4',
      actor: 'Irina Florescu',
      action: 'a predat',
      target: '3 telefoane noi către HR',
      timestamp: addDays(now, -1.6).toISOString(),
    },
    {
      id: 'activity-5',
      actor: 'Vlad Petre',
      action: 'a importat',
      target: 'un CSV cu rezerve de echipamente',
      timestamp: addDays(now, -2).toISOString(),
    },
    {
      id: 'activity-6',
      actor: 'Anca Dumitru',
      action: 'a marcat',
      target: 'două imprimante ca retrase',
      timestamp: addDays(now, -2.5).toISOString(),
    },
    {
      id: 'activity-7',
      actor: 'Răzvan Georgescu',
      action: 'a închis',
      target: 'cererea de service pentru un server',
      timestamp: addDays(now, -3).toISOString(),
    },
    {
      id: 'activity-8',
      actor: 'Sorina Matei',
      action: 'a mutat',
      target: 'două laptopuri în depozitul București',
      timestamp: addDays(now, -3.3).toISOString(),
    },
    {
      id: 'activity-9',
      actor: 'Marius Tudor',
      action: 'a creat',
      target: 'o solicitare de reparație pentru 4 periferice',
      timestamp: addDays(now, -4.1).toISOString(),
    },
    {
      id: 'activity-10',
      actor: 'Elena Rusu',
      action: 'a reatribuit',
      target: 'două monitoare echipei finance',
      timestamp: addDays(now, -4.6).toISOString(),
    },
  ] satisfies ActivityItem[],
  '/events': Array.from({ length: 12 }, (_, index) => {
    const baseDate = addDays(startOfMonth(now), index - 6);
    return {
      id: `event-${index + 1}`,
      date: formatISO(baseDate, { representation: 'date' }),
      title: index % 3 === 0 ? 'Inventariere zonă depozit' : index % 3 === 1 ? 'Verificare garanții' : 'Training echipă',
      time: index % 2 === 0 ? '09:30' : '14:00',
      location: index % 2 === 0 ? 'Sediu central' : 'Online',
      description: 'Eveniment de coordonare pentru echipa IT.',
    } satisfies CalendarEvent;
  }),
};

const NETWORK_DELAY = 400;

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

async function wait() {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));
}

export async function getOverviewStats(): Promise<OverviewStatsResponse> {
  await wait();
  return deepClone(mockDatabase['/stats/overview'] as OverviewStatsResponse);
}

export async function getEquipmentStatus(): Promise<EquipmentStatusRecord[]> {
  await wait();
  return deepClone(mockDatabase['/stats/equipment-status'] as EquipmentStatusRecord[]);
}

export async function getAlerts(limit = 3): Promise<Alert[]> {
  await wait();
  const alerts = mockDatabase['/alerts'] as Alert[];
  return deepClone(alerts.slice(0, limit));
}

export async function getPvQueue(limit = 10): Promise<PvQueueItem[]> {
  await wait();
  const queue = mockDatabase['/pv/queue'] as PvQueueItem[];
  return deepClone(queue.slice(0, limit));
}

export async function getActivity(limit = 10): Promise<ActivityItem[]> {
  await wait();
  const activity = mockDatabase['/activity'] as ActivityItem[];
  return deepClone(activity.slice(0, limit));
}

export async function getEvents(params?: { from?: string; to?: string }): Promise<CalendarEvent[]> {
  await wait();
  const events = mockDatabase['/events'] as CalendarEvent[];
  if (!params?.from && !params?.to) {
    return deepClone(events);
  }
  return deepClone(
    events.filter((event) => {
      if (params.from && event.date < params.from) return false;
      if (params.to && event.date > params.to) return false;
      return true;
    })
  );
}

export async function createEvent(payload: CalendarEventInput): Promise<CalendarEvent> {
  await wait();
  const events = mockDatabase['/events'] as CalendarEvent[];
  const newEvent: CalendarEvent = {
    ...payload,
    id: crypto.randomUUID?.() ?? `event-${events.length + 1}-${Date.now()}`,
  };
  events.push(newEvent);
  mockDatabase['/events'] = events;
  return deepClone(newEvent);
}

export async function updateEvent(id: string, payload: CalendarEventInput): Promise<CalendarEvent> {
  await wait();
  const events = mockDatabase['/events'] as CalendarEvent[];
  const index = events.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error('Event not found');
  }
  const updated = { ...events[index], ...payload } satisfies CalendarEvent;
  events[index] = updated;
  mockDatabase['/events'] = events;
  return deepClone(updated);
}

export async function deleteEvent(id: string): Promise<void> {
  await wait();
  const events = mockDatabase['/events'] as CalendarEvent[];
  mockDatabase['/events'] = events.filter((event) => event.id !== id);
}