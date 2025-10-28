import { addDays, formatISO } from 'date-fns';

export type OverviewStat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  trend: 'up' | 'down';
};

export type EquipmentStatusSummary = {
  category: string;
  online: number;
  maintenance: number;
  offline: number;
};

export type AlertSeverity = 'low' | 'medium' | 'high';

export type Alert = {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  timestamp: string;
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

type MockEndpoint = '/stats/overview' | '/stats/equipment-status' | '/alerts' | '/activity' | '/events';

type MockDatabase = Record<MockEndpoint, unknown>;

const now = new Date();

const mockDatabase: MockDatabase = {
  '/stats/overview': [
    { id: 'incidents', label: 'Incidente rezolvate', value: 128, delta: 12.5, trend: 'up' },
    { id: 'uptime', label: 'Uptime infrastructură', value: 99.2, suffix: '%', delta: -0.4, trend: 'down' },
    { id: 'deployments', label: 'Deployments săptămâna aceasta', value: 34, delta: 8.1, trend: 'up' },
    { id: 'tickets', label: 'Tichete deschise', value: 18, delta: -5.4, trend: 'down' },
  ] satisfies OverviewStat[],
  '/stats/equipment-status': [
    { category: 'Rețea', online: 18, maintenance: 3, offline: 1 },
    { category: 'Servere', online: 12, maintenance: 2, offline: 2 },
    { category: 'Workstation', online: 42, maintenance: 6, offline: 4 },
    { category: 'IoT', online: 25, maintenance: 4, offline: 5 },
  ] satisfies EquipmentStatusSummary[],
  '/alerts': [
    {
      id: 'alert-1',
      title: 'Consum mare de resurse pe clusterul QA',
      description: 'Clusterul QA rulează la 92% CPU. Verifică workload-urile programate.',
      severity: 'high',
      timestamp: addDays(now, -1).toISOString(),
    },
    {
      id: 'alert-2',
      title: 'Actualizare firmware disponibilă',
      description: 'Patch critic de securitate pentru routerele din zona de birouri.',
      severity: 'medium',
      timestamp: addDays(now, -2).toISOString(),
    },
    {
      id: 'alert-3',
      title: 'Backup finalizat',
      description: 'Backupul incremental pentru platforma de billing a fost finalizat.',
      severity: 'low',
      timestamp: addDays(now, -3).toISOString(),
    },
  ] satisfies Alert[],
  '/activity': [
    {
      id: 'activity-1',
      actor: 'Mara T.',
      action: 'a aprobat',
      target: 'cererea de acces pentru noul stagiar',
      timestamp: addDays(now, -0.5).toISOString(),
    },
    {
      id: 'activity-2',
      actor: 'Ioan P.',
      action: 'a actualizat',
      target: 'documentația VPN',
      timestamp: addDays(now, -1).toISOString(),
    },
    {
      id: 'activity-3',
      actor: 'Andreea C.',
      action: 'a creat',
      target: 'un ticket pentru monitorizarea serviciului VoIP',
      timestamp: addDays(now, -1.2).toISOString(),
    },
    {
      id: 'activity-4',
      actor: 'Radu G.',
      action: 'a marcat',
      target: '2 echipamente ca fiind în mentenanță',
      timestamp: addDays(now, -1.5).toISOString(),
    },
    {
      id: 'activity-5',
      actor: 'Elena B.',
      action: 'a publicat',
      target: 'raportul de audit lunar',
      timestamp: addDays(now, -2).toISOString(),
    },
    {
      id: 'activity-6',
      actor: 'Matei S.',
      action: 'a distribuit',
      target: 'credențiale temporare pentru contractori',
      timestamp: addDays(now, -2.5).toISOString(),
    },
    {
      id: 'activity-7',
      actor: 'Camelia D.',
      action: 'a sincronizat',
      target: 'alertările SIEM cu instrumentele interne',
      timestamp: addDays(now, -3).toISOString(),
    },
    {
      id: 'activity-8',
      actor: 'Mihai A.',
      action: 'a finalizat',
      target: 'migrări pentru 5 conturi de utilizatori',
      timestamp: addDays(now, -4).toISOString(),
    },
    {
      id: 'activity-9',
      actor: 'Daria F.',
      action: 'a verificat',
      target: 'nivelul de stoc al componentelor hardware',
      timestamp: addDays(now, -4.5).toISOString(),
    },
    {
      id: 'activity-10',
      actor: 'Sorin L.',
      action: 'a resetat',
      target: 'switch-ul din sala de ședințe',
      timestamp: addDays(now, -5).toISOString(),
    },
  ] satisfies ActivityItem[],
  '/events': Array.from({ length: 14 }, (_, idx) => {
    const date = addDays(now, idx - 4);
    return {
      id: `event-${idx + 1}`,
      date: formatISO(date, { representation: 'date' }),
      title: idx % 3 === 0 ? 'Revizuire securitate' : idx % 3 === 1 ? 'Întâlnire cu furnizorii' : 'Sesiune de suport',
      time: idx % 2 === 0 ? '10:00' : '15:30',
      location: idx % 2 === 0 ? 'Sala Atlas' : 'Online',
    } satisfies CalendarEvent;
  }),
};

const NETWORK_DELAY = 450;

async function mockGet<T>(endpoint: MockEndpoint): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, NETWORK_DELAY));
  const data = mockDatabase[endpoint];
  return JSON.parse(JSON.stringify(data)) as T;
}

export function getOverviewStats() {
  return mockGet<OverviewStat[]>('/stats/overview');
}

export function getEquipmentStatus() {
  return mockGet<EquipmentStatusSummary[]>('/stats/equipment-status');
}

export function getAlerts() {
  return mockGet<Alert[]>('/alerts');
}

export function getActivity() {
  return mockGet<ActivityItem[]>('/activity');
}

export function getEvents() {
  return mockGet<CalendarEvent[]>('/events');
}