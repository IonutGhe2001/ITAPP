import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, BarChart3 } from 'lucide-react';
import { endOfMonth, format, formatISO, startOfMonth } from 'date-fns';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { genereazaProcesVerbal } from '@/features/proceseVerbale/proceseVerbaleService';

import {
  createEvent,
  deleteEvent,
  getAlerts,
  getEquipmentStatus,
  getEvents,
  getOverviewStats,
  getPvQueue,
  updateEvent,
  type Alert,
  type CalendarEvent,
  type CalendarEventInput,
  type EquipmentStatusRecord,
  type OverviewStatsResponse,
  type PvQueueItem,
} from './api';
import { AlertItem } from './components/AlertItem';
import { EmptyState } from './components/EmptyState';
import { KpiCard } from './components/KpiCard';
import { PvQueue } from './components/PVQueue';
import { CalendarCompact } from './components/CalendarCompact';
import { QuickActionsCompact } from './components/QuickActionsCompact';

const EquipmentStatusChart = lazy(() => import('./components/EquipmentStatusChart'));

const READ_ALERTS_STORAGE_KEY = 'dashboard.readAlerts';

const KPI_CONFIG = [
  { key: 'total', label: 'Total echipamente', href: ROUTES.EQUIPMENT },
  { key: 'in_stock', label: 'În stoc', href: `${ROUTES.EQUIPMENT}?status=in_stoc` },
  { key: 'allocated', label: 'Alocate', href: `${ROUTES.EQUIPMENT}?status=alocat` },
  {
    key: 'repair_retired',
    label: 'În mentenanță / retrase',
    href: `${ROUTES.EQUIPMENT}?status=mentenanta`,
  },
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
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const quickActionsRef = useRef<HTMLDivElement | null>(null);
  const [quickActionsHeight, setQuickActionsHeight] = useState<number>();
  const [generatingPvId, setGeneratingPvId] = useState<string | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [readAlertIds, setReadAlertIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set<string>();
    try {
      const raw = window.localStorage.getItem(READ_ALERTS_STORAGE_KEY);
      if (!raw) return new Set<string>();
      const parsed = JSON.parse(raw) as string[];
      return new Set(parsed.filter((value) => typeof value === 'string'));
    } catch (error) {
      console.warn('Nu am putut citi alertele citite din localStorage.', error);
      return new Set<string>();
    }
  });
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      READ_ALERTS_STORAGE_KEY,
      JSON.stringify(Array.from(readAlertIds))
    );
  }, [readAlertIds]);

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

  const updateEventMutation = useMutation<
    CalendarEvent,
    Error,
    { id: string; data: CalendarEventInput }
  >({
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

  const alerts = useMemo(() => {
    const list = alertsQuery.data ?? [];
    if (!list.length) return [] as Alert[];
    return list.filter((alert) => !readAlertIds.has(alert.id));
  }, [alertsQuery.data, readAlertIds]);
  const pvQueueItems = useMemo(() => pvQueueQuery.data ?? [], [pvQueueQuery.data]);

  const handleReadAllAlerts = () => {
    const current = alertsQuery.data ?? [];
    if (!current.length) return;
    setReadAlertIds((prev) => {
      const next = new Set(prev);
      current.forEach((alert) => next.add(alert.id));
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const element = quickActionsRef.current;
    if (!element) return;

    const mediaQuery = window.matchMedia('(min-width: 1280px)');

    const updateHeight = () => {
      const card = quickActionsRef.current;
      if (!card) return;
      if (!mediaQuery.matches) {
        setQuickActionsHeight(undefined);
        return;
      }

      setQuickActionsHeight(card.getBoundingClientRect().height);
    };

    updateHeight();

    const handleMediaChange = () => updateHeight();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleMediaChange);
    }

    let observer: ResizeObserver | undefined;
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(() => {
        updateHeight();
      });
      observer.observe(element);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handleMediaChange);
      }

      observer?.disconnect();
    };
  }, []);

  const selectedDateKey = useMemo(() => format(selectedDate, 'yyyy-MM-dd'), [selectedDate]);
  const eventsForSelectedDay = useMemo(() => {
    const events = eventsQuery.data ?? [];
    return [...events]
      .filter((event) => event.date === selectedDateKey)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''));
  }, [eventsQuery.data, selectedDateKey]);

  const isInitialEventsLoading = eventsQuery.isLoading && !eventsQuery.data;
  const isSavingEvent = createEventMutation.isPending || updateEventMutation.isPending;
  const deletingEventId = deleteEventMutation.isPending
    ? (deleteEventMutation.variables ?? null)
    : null;

  const sanitizeFileName = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'proces-verbal';

  const downloadPdf = (objectUrl: string, fileName: string) => {
    if (typeof window === 'undefined') {
      URL.revokeObjectURL(objectUrl);
      return;
    }

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 2000);
  };

  const handleGeneratePv = async (item: PvQueueItem) => {
    try {
      setGeneratingPvId(item.id);
      const objectUrl = await genereazaProcesVerbal(item.employeeId, 'PREDARE_PRIMIRE', {
        fromChanges: true,
      });
      const fileName = `pv-${sanitizeFileName(item.employee)}.pdf`;
      downloadPdf(objectUrl, fileName);
      toast({
        title: 'Proces verbal generat',
        description: `Documentul pentru ${item.employee} a fost descărcat.`,
      });
    } catch (error) {
      console.error('Eroare la generarea procesului verbal', error);
      toast({
        title: 'Eroare la generare',
        description: 'Nu am putut genera procesul verbal. Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPvId(null);
      void queryClient.invalidateQueries({ queryKey: ['pv', 'queue'] });
    }
  };

  const handleGenerateAndSendForSignature = async (item: PvQueueItem) => {
    if (!item.employeeEmail) {
      toast({
        title: 'Email lipsă',
        description: `Angajatul ${item.employee} nu are o adresă de email asociată.`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setGeneratingPvId(item.id);
      const objectUrl = await genereazaProcesVerbal(item.employeeId, 'PREDARE_PRIMIRE', {
        fromChanges: true,
      });
      const fileName = `pv-${sanitizeFileName(item.employee)}.pdf`;
      downloadPdf(objectUrl, fileName);
      
      // Create mailto link with subject and employee email
      const subject = encodeURIComponent('De semnat PV');
      const body = encodeURIComponent('');
      const mailtoLink = `mailto:${item.employeeEmail}?subject=${subject}&body=${body}`;
      
      // Small delay to allow download to start before opening email client
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 500);
      
      toast({
        title: 'PV generat și email deschis',
        description: `Atașați manual fișierul ${fileName} în emailul către ${item.employee}.`,
      });
    } catch (error) {
      console.error('Eroare la generarea procesului verbal', error);
      toast({
        title: 'Eroare la generare',
        description: 'Nu am putut genera procesul verbal. Încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPvId(null);
      void queryClient.invalidateQueries({ queryKey: ['pv', 'queue'] });
    }
  };

  const handleGenerateAllPv = async (queueItems: PvQueueItem[]) => {
    if (!queueItems.length) return;
    setIsGeneratingAll(true);
    try {
      for (const [index, item] of queueItems.entries()) {
        setGeneratingPvId(item.id);
        const objectUrl = await genereazaProcesVerbal(item.employeeId, 'PREDARE_PRIMIRE', {
          fromChanges: true,
        });
        const fileName = `pv-${sanitizeFileName(item.employee)}-${index + 1}.pdf`;
        downloadPdf(objectUrl, fileName);
      }
      toast({
        title: 'Procese verbale generate',
        description: `${queueItems.length} documente au fost descărcate.`,
      });
    } catch (error) {
      console.error('Eroare la generarea proceselor verbale', error);
      toast({
        title: 'Eroare la generare',
        description:
          'Nu am putut genera toate procesele verbale din coadă. Verifică situația și încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPvId(null);
      setIsGeneratingAll(false);
      void queryClient.invalidateQueries({ queryKey: ['pv', 'queue'] });
    }
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
    <main className="mx-auto max-w-screen-2xl space-y-6 px-4 py-6 lg:px-6">
      <header className="space-y-2">
        <h1 className="text-foreground text-3xl font-semibold sm:text-4xl">
          Panou echipamente IT APP
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Monitorizează inventarul, urmărește procesele-verbale și planifică activitățile echipei
          dintr-o singură interfață.
        </p>
      </header>

      <section className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-12">
        {overviewQuery.isLoading ? (
          KPI_SKELETONS.map((_, index) => (
            <div
              key={index}
              className="border-border bg-muted/30 min-h-[128px] animate-pulse rounded-xl border xl:col-span-3"
              aria-hidden
            />
          ))
        ) : formattedKpis.length ? (
          formattedKpis.map((stat) => (
            <div key={stat.key} className="xl:col-span-3">
              <KpiCard
                title={stat.label}
                value={stat.value}
                delta={stat.delta}
                trend={stat.trend}
                href={stat.href}
              />
            </div>
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

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card className="border-border/80 bg-card/90 flex min-h-[520px] flex-col border shadow-sm xl:col-span-8">
          <CardHeader className="border-border/60 flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
                <BarChart3 className="text-primary h-5 w-5" aria-hidden />
                Stare echipamente
              </CardTitle>
              <CardDescription>
                Analizează distribuția echipamentelor active, alocate și retrase.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-4">
            {equipmentStatusQuery.isLoading ? (
              <div className="bg-muted/30 h-[320px] animate-pulse rounded-lg" aria-hidden />
            ) : equipmentStatusQuery.data?.length ? (
              <Suspense
                fallback={
                  <div className="bg-muted/30 h-[320px] animate-pulse rounded-lg" aria-hidden />
                }
              >
                <EquipmentStatusChart data={equipmentStatusQuery.data} />
              </Suspense>
            ) : (
              <EmptyState
                title="Nu există date despre inventar"
                description="Importă stocurile de echipamente pentru a vedea evoluția în timp."
                action={
                  <Button type="button" size="sm">
                    Importă inventar
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/90 flex min-h-[520px] flex-col border shadow-sm xl:col-span-4">
          <CardHeader className="border-border/60 flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
                <AlertCircle className="text-primary h-5 w-5" aria-hidden />
                Alerte prioritare
              </CardTitle>
              <CardDescription>
                Primești maximum trei alerte critice pentru inventar.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReadAllAlerts}
                disabled={alertsQuery.isLoading || alerts.length === 0}
              >
                Marchează toate ca citite
              </Button>
              <Button type="button" variant="outline" size="sm" asChild>
                <Link to={ROUTES.EQUIPMENT}>Vezi toate</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col space-y-3 p-4">
            {alertsQuery.isLoading ? (
              ALERT_SKELETONS.map((_, index) => (
                <div
                  key={index}
                  className="border-border bg-muted/30 h-20 animate-pulse rounded-lg border"
                  aria-hidden
                />
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
      </section>

      <section className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-12">
        <Card
          className="border-border/80 bg-card/90 flex flex-col border shadow-sm xl:col-span-8"
          style={
            quickActionsHeight
              ? { height: quickActionsHeight, maxHeight: quickActionsHeight }
              : undefined
          }
        >
          <CardHeader className="border-border/60 flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-foreground text-lg font-semibold">Coada de PV</CardTitle>
              <CardDescription>
                Finalizează documentele de predare pentru alocările recente.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-0 flex-1 flex-col p-4">
            <PvQueue
              items={pvQueueItems}
              isLoading={pvQueueQuery.isLoading}
              onGenerate={handleGeneratePv}
              onGenerateAndSend={handleGenerateAndSendForSignature}
              onGenerateAll={handleGenerateAllPv}
              generatingId={generatingPvId}
              isBulkGenerating={isGeneratingAll}
            />
          </CardContent>
        </Card>

        <div className="xl:col-span-4">
          <QuickActionsCompact ref={quickActionsRef} />
        </div>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-6">
        <CalendarCompact
          events={eventsQuery.data ?? []}
          eventsForSelectedDay={eventsForSelectedDay}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onMonthChange={setCurrentMonth}
          onSelectDate={setSelectedDate}
          onCreate={handleCreateEvent}
          onUpdate={handleUpdateEvent}
          onDelete={handleDeleteEvent}
          isLoading={isInitialEventsLoading}
          isSaving={isSavingEvent}
          deletingId={deletingEventId}
          className="h-full"
        />
      </section>
    </main>
  );
}
