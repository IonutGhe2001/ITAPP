'use client';

import { useMemo } from 'react';
import DashboardSectionCard from '@layouts/components/DashboardSectionCard';
import NavigationShortcuts from './sections/NavigationShortcuts';
import OverviewCards from './sections/OverviewCards';
import QuickActions from './sections/QuickActions';
import RecentUpdates from './sections/RecentUpdates';
import { EventCalendar, EventList, EventForm } from '@/features/events';
import {
  BarChartIcon,
  FlashlightIcon,
  CompassIcon,
  Clock4Icon,
  CalendarCheckIcon,
  PlusIcon,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import {
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { ro } from 'date-fns/locale';

import { computeHighlightDates } from './utils';
import { useDashboardEvents } from './useDashboardEvents';

export default function Dashboard() {
  const {
    selectedDay,
    setSelectedDay,
    eventsInDay,
    evenimente,
    editing,
    formDate,
    showFormModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDayDoubleClick,
    handleEditEvent,
    setShowFormModal,
    openCreateEvent,
  } = useDashboardEvents();

  const parsedEvents = useMemo(
    () =>
      evenimente.map((event) => ({
        ...event,
        data: new Date(event.data),
      })),
    [evenimente]
  );

  const upcomingEvent = useMemo(() => {
    const today = startOfDay(new Date());
    return parsedEvents
      .filter((event) => isAfter(event.data, today) || isSameDay(event.data, today))
      .sort((a, b) => a.data.getTime() - b.data.getTime())[0];
  }, [parsedEvents]);

  const eventsThisWeek = useMemo(() => {
    const today = startOfDay(new Date());
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    return parsedEvents.filter((event) =>
      isWithinInterval(event.data, {
        start,
        end,
      })
    );
  }, [parsedEvents]);

  const highlightCards = useMemo(
    () => [
      {
        label: 'Evenimente astăzi',
        value: eventsInDay.length.toString(),
        description:
          eventsInDay.length > 0
            ? 'Ai totul pregătit pentru ziua de astăzi.'
            : 'Nu există evenimente planificate pentru astăzi.',
      },
      {
        label: 'Săptămâna aceasta',
        value: eventsThisWeek.length.toString(),
        description:
          eventsThisWeek.length > 0
            ? 'Ești implicat într-o săptămână plină de activitate.'
            : 'Ai un calendar liber în următoarele zile.',
      },
      {
        label: 'Următorul eveniment',
        value: upcomingEvent
          ? format(upcomingEvent.data, "d MMM", { locale: ro })
          : '—',
        description: upcomingEvent
          ? `${upcomingEvent.titlu} • ${
              upcomingEvent.ora
                ? `ora ${upcomingEvent.ora}`
                : format(upcomingEvent.data, "HH:mm", { locale: ro })
            }`
          : 'Planifică un nou eveniment pentru a-l vedea aici.',
      },
    ],
    [eventsInDay.length, eventsThisWeek.length, upcomingEvent]
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.35),_transparent_65%)]" />
      <Container className="relative z-10 py-10">
        <div className="flex flex-col gap-10">
          <section className="relative overflow-hidden rounded-[32px] border border-border/60 bg-gradient-to-br from-background/90 via-background/70 to-background/90 p-8 shadow-xl shadow-primary/10 backdrop-blur">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-32 left-12 h-52 w-52 rounded-full bg-chart-3/10 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1.5fr,1fr]">
              <div className="flex flex-col justify-between gap-8">
                <div className="space-y-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                    Panou de control
                  </span>
                  <h1 className="text-foreground text-3xl font-semibold leading-tight sm:text-4xl">
                    Vizualizează activitatea echipei într-un mod mai clar și mai modern.
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Ai acces rapid la statistici, evenimente și acțiuni importante. Gestionează-ți ziua cu un singur
                    click și rămâi conectat la ceea ce contează.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {highlightCards.map((card) => (
                    <div
                      key={card.label}
                      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/80 p-4 shadow-inner shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="absolute inset-x-0 -top-16 h-24 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                      <div className="relative flex flex-col gap-1">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {card.label}
                        </span>
                        <span className="text-foreground text-2xl font-semibold">
                          {card.value}
                        </span>
                        <p className="text-muted-foreground text-xs leading-snug">{card.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <Button size="lg" onClick={() => openCreateEvent()} className="gap-2">
                    <PlusIcon className="h-4 w-4" /> Planifică un eveniment
                  </Button>
                </div>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background/70 p-4 shadow-lg shadow-primary/10">
                <div className="flex items-center gap-2 pb-4 text-sm font-semibold text-muted-foreground">
                  <BarChartIcon className="h-4 w-4" />
                  Prezentare generală
                </div>
                <OverviewCards />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.8fr,1fr]">
            <DashboardSectionCard title="Evenimente" icon={<CalendarCheckIcon />}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium text-primary">Următorul eveniment</p>
                    <p className="text-foreground text-lg font-semibold">
                      {upcomingEvent ? upcomingEvent.titlu : 'Niciun eveniment planificat'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {upcomingEvent
                        ? `Pe ${format(upcomingEvent.data, "d MMMM 'la' HH:mm", { locale: ro })}`
                        : 'Adaugă un eveniment pentru a umple calendarul.'}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => openCreateEvent()}>
                    <PlusIcon className="h-4 w-4" />
                    Adaugă eveniment
                  </Button>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row">
                  <div className="lg:w-[360px]">
                    <EventCalendar
                      selected={selectedDay}
                      onSelect={setSelectedDay}
                      onDoubleClick={handleDayDoubleClick}
                      highlightDates={computeHighlightDates(evenimente)}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-inner">
                      <EventList events={eventsInDay} onEdit={handleEditEvent} onDelete={handleDelete} />
                    </div>
                  </div>
                </div>
              </div>
            </DashboardSectionCard>

            <div className="flex flex-col gap-8">
              <DashboardSectionCard title="Acțiuni rapide" icon={<FlashlightIcon />}>
                <QuickActions />
              </DashboardSectionCard>

              <DashboardSectionCard title="Navigare" icon={<CompassIcon />}>
                <NavigationShortcuts />
              </DashboardSectionCard>

              <DashboardSectionCard title="Activitate recentă" icon={<Clock4Icon />} className="p-0">
                <div className="flex h-72 flex-col overflow-hidden">
                  <RecentUpdates />
                </div>
              </DashboardSectionCard>
            </div>
          </div>

          <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
            <DialogContent className="sm:max-w-lg">
              {formDate && (
                <EventForm
                  selectedDay={formDate}
                  initial={editing}
                  onSave={editing ? handleUpdate : (_id: number | null, data) => handleCreate(data)}
                  onCancel={() => setShowFormModal(false)}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </div>
  );
}
