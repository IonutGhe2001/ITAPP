import { lazy, Suspense, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Activity, AlertCircle, BarChart3, CalendarDays } from 'lucide-react';
import { endOfMonth, format, formatISO, startOfMonth } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';

import {
  createEvent,
  deleteEvent,
  getActivity,
  getAlerts,
  getEquipmentStatus,
  getEvents,
  getOverviewStats,
  getPvQueue,
  updateEvent,
  type ActivityItem,
  type Alert,
  type CalendarEvent,
  type CalendarEventInput,
  type EquipmentStatusRecord,
  type OverviewStatsResponse,
  type PvQueueItem,
} from './api';
import { ActivityFeed } from './components/ActivityFeed';
import { AlertItem } from './components/AlertItem';
import { EmptyState } from './components/EmptyState';
import { EventList } from './components/EventList';
import { KpiCard } from './components/KpiCard';
import { MiniCalendar } from './components/MiniCalendar';
import { PvQueue } from './components/PVQueue'
import { QuickActions } from './components/QuickActions';

const EquipmentStatusChart = lazy(() => import('./components/EquipmentStatusChart'));

const KPI_CONFIG = [
  { key: 'total', label: 'Total echipamente', href: ROUTES.EQUIPMENT },
  { key: 'in_stock', label: 'În stoc', href: `${ROUTES.EQUIPMENT}?status=in-stock` },
  { key: 'allocated', label: 'Alocate', href: `${ROUTES.EQUIPMENT}?status=allocated` },
  { key: 'repair_retired', label: 'În reparație / retrase', href: `${ROUTES.EQUIPMENT}?status=repair` },
] as const;

type KpiKey = (typeof KPI_CONFIG)[number]['key'];

type OverviewWithDisplay = {
  key: KpiKey;
  label: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'neutral';
  href: string;
};

const numberFormatter = new Intl.NumberFormat('ro-RO');

const KPI_SKELETONS = Array.from({ length: 4 });
const ALERT_SKELETONS = Array.from({ length: 3 });

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const queryClient = useQueryClient();

  const overviewQuery = useQuery<OverviewStatsResponse>({
    queryKey: ['stats', 'overview'],
    queryFn: getOverviewStats,
    staleTime: 60_000,
  });

  const equipmentStatusQuery = useQuery<EquipmentStatusRecord[]>({
    queryKey: ['stats', 'equipment-status'],
    queryFn: getEquipmentStatus,
    staleTime: 60_000,
  });

  const alertsQuery = useQuery<Alert[]>({
    queryKey: ['alerts', 3],
    queryFn: () => getAlerts(3),
    staleTime: 30_000,
  });

  const pvQueueQuery = useQuery<PvQueueItem[]>({
    queryKey: ['pv', 'queue', 10],
    queryFn: () => getPvQueue(10),
    staleTime: 30_000,
  });

  const activityQuery = useQuery<ActivityItem[]>({
    queryKey: ['activity', 10],
    queryFn: () => getActivity(10),
    staleTime: 30_000,
  });

  const monthRange = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return {
      start,
      end,
      from: formatISO(start, { representation: 'date' }),
      to: formatISO(end, { representation: 'date' }),
    };
  }, [currentMonth]);

  const eventsQuery = useQuery<CalendarEvent[]>({
    queryKey: ['events', monthRange.from, monthRange.to],
    queryFn: () => getEvents({ from: monthRange.from, to: monthRange.to }),
    staleTime: 30_000,
  });

  const createEventMutation = useMutation<CalendarEvent, Error, CalendarEventInput>({
    mutationFn: (payload) => createEvent(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEventMutation = useMutation<CalendarEvent, Error, { id: string; data: CalendarEventInput }>({
    mutationFn: ({ id, data }) => updateEvent(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEventMutation = useMutation<void, Error, string>({
    mutationFn: (id) => deleteEvent(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const formattedKpis: OverviewWithDisplay[] = useMemo(() => {
    const overview = overviewQuery.data;
    if (!overview) return [];

    return KPI_CONFIG.map((item) => {
      const value = overview[item.key];
      const delta = overview.deltas[item.key];
      const trend: OverviewWithDisplay['trend'] = delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral';
      return {
        key: item.key,
        label: item.label,
        value: numberFormatter.format(value),
        delta,
        trend,
        href: item.href,
      } satisfies OverviewWithDisplay;
    });
  }, [overviewQuery.data]);

  const alerts = useMemo(() => alertsQuery.data ?? [], [alertsQuery.data]);
  const pvQueueItems = useMemo(() => pvQueueQuery.data ?? [], [pvQueueQuery.data]);
  const recentActivity = useMemo(() => activityQuery.data ?? [], [activityQuery.data]);

  const selectedDateKey = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const eventsForSelectedDay = useMemo(() => {
    const events = eventsQuery.data ?? [];
    return [...events]
      .filter((event) => event.date === selectedDateKey)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  }, [eventsQuery.data, selectedDateKey]);

  const isInitialEventsLoading = eventsQuery.isLoading && !eventsQuery.data;
  const isSavingEvent = createEventMutation.isPending || updateEventMutation.isPending;
  const deletingEventId = deleteEventMutation.isPending ? deleteEventMutation.variables ?? null : null;

  const handleGeneratePv = (item: PvQueueItem) => {
    console.info('Generează PV pentru', item.employee, 'și', item.equipment);
  };

  const handleCreateEvent = async (input: CalendarEventInput) => {
    await createEventMutation.mutateAsync(input);
  };

  const handleUpdateEvent = async (id: string, input: CalendarEventInput) => {
    await updateEventMutation.mutateAsync({ id, data: input });
  };

  const handleDeleteEvent = async (id: string) => {
    await deleteEventMutation.mutateAsync(id);
  };

  return (
    <main className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Panou echipamente IT APP</h1>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          Monitorizează inventarul, urmărește procesele-verbale și planifică activitățile echipei dintr-o singură interfață.
        </p>
      </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewQuery.isLoading
          ? KPI_SKELETONS.map((_, index) => (
              <div key={index} className="h-[124px] animate-pulse rounded-xl border border-border bg-muted/30" aria-hidden />
            ))
          : formattedKpis.length ? (
              formattedKpis.map((stat) => (
                <KpiCard key={stat.key} title={stat.label} value={stat.value} delta={stat.delta} trend={stat.trend} href={stat.href} />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="Indicatorii nu sunt disponibili"
                  description="Încarcă datele de inventar pentru a vedea statistici pe ultimele 7 zile."
                />
              </div>
            )}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr] xl:items-start">
        <div className="space-y-6">
          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
                  Stare echipamente
                </CardTitle>
                <CardDescription>Analizează distribuția echipamentelor active, alocate și retrase.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {equipmentStatusQuery.isLoading ? (
                <div className="h-[320px] animate-pulse rounded-lg bg-muted/30" aria-hidden />
              ) : equipmentStatusQuery.data?.length ? (
                <Suspense fallback={<div className="h-[320px] animate-pulse rounded-lg bg-muted/30" aria-hidden />}>
                  <EquipmentStatusChart data={equipmentStatusQuery.data} />
                </Suspense>
              ) : (
                <EmptyState
                  title="Nu există date despre inventar"
                  description="Importă stocurile de echipamente pentru a vedea evoluția în timp."
                  action={<Button type="button" size="sm">Importă inventar</Button>}
                />
              )}
            </CardContent>
          </Card>

          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <AlertCircle className="h-5 w-5 text-primary" aria-hidden />
                  Alerte prioritare
                </CardTitle>
                <CardDescription>Primești maximum trei alerte critice pentru inventar.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm">Vezi toate</Button>
            </CardHeader>
          <CardContent className="space-y-3 pt-6">
              {alertsQuery.isLoading ? (
                ALERT_SKELETONS.map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-lg border border-border bg-muted/30" aria-hidden />
                ))
              ) : alerts.length ? (
                alerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
              ) : (
                <EmptyState
                  title="Nu există alerte active"
                  description="Verificăm constant inventarul și îți vom semnala rapid problemele."
                />
              )}
            </CardContent>
          </Card>

          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold text-foreground">Coada de PV</CardTitle>
                <CardDescription>Finalizează documentele de predare pentru alocările recente.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                <PvQueue items={pvQueueItems} isLoading={pvQueueQuery.isLoading} onGenerate={handleGeneratePv} />
              </div>
            </CardContent>
          </Card>

          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Activity className="h-5 w-5 text-primary" aria-hidden />
                  Activitate recentă
                </CardTitle>
                <CardDescription>Ultimele actualizări pentru inventar și alocări.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                <ActivityFeed items={recentActivity} isLoading={activityQuery.isLoading} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 xl:sticky xl:top-20">
          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Acțiuni rapide</CardTitle>
              <CardDescription>Accesează cele mai frecvente acțiuni pentru echipa de operațiuni.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <QuickActions />
            </CardContent>
          </Card>

          <Card className="h-auto self-start border border-border bg-card/80 shadow-none">
            <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <CalendarDays className="h-5 w-5 text-primary" aria-hidden />
                  Calendar echipamente
                </CardTitle>
                <CardDescription>Organizează evenimentele și verificările din depozit.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid min-h-[300px] gap-6 lg:grid-cols-[0.95fr_1fr]">
                <MiniCalendar
                  events={eventsQuery.data ?? []}
                  currentMonth={currentMonth}
                  selectedDate={selectedDate}
                  onMonthChange={setCurrentMonth}
                  onSelectDate={setSelectedDate}
                  isLoading={isInitialEventsLoading}
                />
                <EventList
                  date={selectedDate}
                  events={eventsForSelectedDay}
                  onCreate={handleCreateEvent}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                  isLoading={isInitialEventsLoading}
                  isSaving={isSavingEvent}
                  deletingId={deletingEventId}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
