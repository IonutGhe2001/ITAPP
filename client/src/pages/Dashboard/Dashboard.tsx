import { lazy, Suspense, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertCircle, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getActivity,
  getAlerts,
  getEquipmentStatus,
  getEvents,
  getOverviewStats,
  type ActivityItem,
  type Alert,
  type EquipmentStatusSummary,
  type OverviewStat,
} from './api';
import { AlertItem } from './components/AlertItem';
import { ActivityFeed } from './components/ActivityFeed';
import { EmptyState } from './components/EmptyState';
import { KpiCard } from './components/KpiCard';
import { MiniCalendar } from './components/MiniCalendar';
import { QuickActions } from './components/QuickActions';

const EquipmentStatusChart = lazy(() => import('./components/EquipmentStatusChart'));

const KPI_SKELETONS = Array.from({ length: 4 });
const ALERT_SKELETONS = Array.from({ length: 3 });

const compactNumberFormatter = new Intl.NumberFormat('ro-RO', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

function formatKpiValue(value: number, suffix?: string) {
  const formattedValue =
    value >= 1000
      ? compactNumberFormatter.format(value)
      : Number.isInteger(value)
      ? value.toString()
      : value.toFixed(1);
  return suffix ? `${formattedValue}${suffix}` : formattedValue;
}

export default function Dashboard() {
  const { data: overviewStats, isLoading: isLoadingOverview } = useQuery<OverviewStat[]>({
    queryKey: ['stats', 'overview'],
    queryFn: getOverviewStats,
    staleTime: 60_000,
  });

  const { data: equipmentStatus, isLoading: isLoadingEquipment } = useQuery<EquipmentStatusSummary[]>({
    queryKey: ['stats', 'equipment-status'],
    queryFn: getEquipmentStatus,
    staleTime: 60_000,
  });

  const { data: alerts, isLoading: isLoadingAlerts } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: getAlerts,
    staleTime: 30_000,
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery<ActivityItem[]>({
    queryKey: ['activity'],
    queryFn: getActivity,
    staleTime: 30_000,
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    staleTime: 60_000,
  });

  const formattedKpis = useMemo(
    () =>
      (overviewStats ?? []).map((stat) => ({
        ...stat,
        displayValue: formatKpiValue(stat.value, stat.suffix),
      })),
    [overviewStats]
  );

  const topAlerts = useMemo(() => (alerts ?? []).slice(0, 3), [alerts]);
  const recentActivity = useMemo(() => (activity ?? []).slice(0, 10), [activity]);

  const handleKpiClick = (id: string) => {
    console.info(`KPI clicked: ${id}`);
  };

  return (
    <main className="space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">Panou operațional IT APP</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Monitorizează indicatorii cheie ai infrastructurii, urmărește activitatea echipei și acționează rapid atunci când apar
          alerte importante.
        </p>
      </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoadingOverview
          ? KPI_SKELETONS.map((_, index) => (
              <div key={index} className="h-[124px] animate-pulse rounded-xl border border-border bg-muted/30" aria-hidden />
            ))
          : formattedKpis.map((stat) => (
              <KpiCard
                key={stat.id}
                title={stat.label}
                value={stat.displayValue}
                delta={stat.delta}
                trend={stat.trend}
                onClick={() => handleKpiClick(stat.id)}
              />
            ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 shadow-none border border-border bg-card/80 xl:col-span-7">
          <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
                Stare echipamente
              </CardTitle>
              <CardDescription>Distribuția echipamentelor funcționale, în mentenanță și offline.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingEquipment ? (
              <div className="h-[320px] animate-pulse rounded-lg bg-muted/30" aria-hidden />
            ) : equipmentStatus && equipmentStatus.length ? (
              <Suspense fallback={<div className="h-[320px] animate-pulse rounded-lg bg-muted/30" aria-hidden />}>
                <EquipmentStatusChart data={equipmentStatus} />
              </Suspense>
            ) : (
              <EmptyState
                title="Nu există date despre echipamente"
                description="Importă inventarul pentru a vedea starea echipamentelor."
                action={<Button type="button" size="sm">Importă date</Button>}
              />
            )}
          </CardContent>
        </Card>

          <Card className="col-span-12 shadow-none border border-border bg-card/80 xl:col-span-5">
          <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <AlertCircle className="h-5 w-5 text-primary" aria-hidden />
                Alerte active
              </CardTitle>
              <CardDescription>Primește maximum trei alerte relevante pentru echipă.</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm">Vezi toate</Button>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {isLoadingAlerts ? (
              ALERT_SKELETONS.map((_, index) => (
                <div key={index} className="h-20 animate-pulse rounded-lg border border-border bg-muted/30" aria-hidden />
              ))
            ) : topAlerts.length ? (
              topAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
            ) : (
              <EmptyState
                title="Nicio alertă activă"
                description="Monitorizăm în continuare. Vei fi notificat când apare ceva important."
              />
            )}
          </CardContent>
        </Card>
      </div>

            <div className="grid gap-6 xl:grid-cols-12">
        <Card className="col-span-12 shadow-none border border-border bg-card/80 xl:col-span-7">
          <CardHeader className="flex flex-row items-start gap-4 border-b border-border/60 pb-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Activity className="h-5 w-5 text-primary" aria-hidden />
                Activitate recentă
              </CardTitle>
              <CardDescription>Ultimele actualizări din echipa de operațiuni IT.</CardDescription>
            </div>
            </CardHeader>
          <CardContent className="pt-6">
            <ActivityFeed items={recentActivity} isLoading={isLoadingActivity} />
          </CardContent>
        </Card>

        <div className="col-span-12 flex flex-col gap-6 xl:col-span-5">
          <Card className="shadow-none border border-border bg-card/80">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Acțiuni rapide</CardTitle>
              <CardDescription>Alege una dintre acțiunile frecvente pentru a reacționa imediat.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <QuickActions />
            </CardContent>
          </Card>

            <Card className="shadow-none border border-border bg-card/80">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Calendar</CardTitle>
              <CardDescription>Evenimente planificate pe zile. Lista este actualizată zilnic.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <MiniCalendar events={events ?? []} isLoading={isLoadingEvents} />
            </CardContent>
          </Card>
        </div>
        </div>
    </main>
  );
}
