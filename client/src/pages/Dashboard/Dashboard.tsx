'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
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
  SparklesIcon,
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import Container from '@/components/Container';
import { cn } from '@/lib/utils';

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
  } = useDashboardEvents();

  const today = new Date();

  const upcomingEvent = useMemo(() => {
    const now = new Date();
    return (
      evenimente
        .map((event) => ({ event, date: new Date(event.data) }))
        .filter(({ date }) => !Number.isNaN(date.getTime()) && date >= now)
        .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null
    );
  }, [evenimente]);

  const upcomingEventTitle = upcomingEvent?.event.titlu ?? 'Niciun eveniment programat';
  const upcomingEventSubtitle = upcomingEvent
    ? `${format(upcomingEvent.date, 'd MMMM yyyy', { locale: ro })}${
        upcomingEvent.event.ora ? ` · ${upcomingEvent.event.ora}` : ''
      }`
    : 'Planifică următoarele activități.';

  const highlightCards = useMemo(
    () => [
      {
        id: 'today',
        label: 'Evenimente astăzi',
        value: eventsInDay.length.toString().padStart(2, '0'),
        description: 'Monitorizate în calendarul intern.',
      },
      {
        id: 'total',
        label: 'Total evenimente active',
        value: evenimente.length.toString().padStart(2, '0'),
        description: 'Sincronizate cu echipa și resursele.',
      },
      {
        id: 'next',
        label: 'Următorul eveniment',
        value: upcomingEventTitle,
        description: upcomingEventSubtitle,
      },
    ],
    [eventsInDay.length, evenimente.length, upcomingEventSubtitle, upcomingEventTitle]
  );

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-br from-primary/20 via-background to-background opacity-80 blur-3xl" />
      <Container className="relative z-10 py-10">
        <div className="flex flex-col gap-10">
          <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 p-8 shadow-[0_20px_80px_-40px_rgba(15,23,42,0.55)] backdrop-blur">
            <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-primary/20 blur-3xl" aria-hidden />
            <div className="absolute -bottom-32 -left-10 h-64 w-64 rounded-full bg-muted/40 blur-3xl" aria-hidden />
            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                    <SparklesIcon className="h-3 w-3" /> Panou general
                  </span>
                  <div>
                    <h1 className="text-foreground text-3xl font-semibold md:text-4xl">Dashboard ITAPP</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
                      Vizualizează performanța echipei, organizează evenimentele și accesează rapid zonele operaționale. Un spațiu modern, construit pentru ritmul accelerat al internshipului.
                    </p>
                  </div>
                </div>
                <div className="border-border/70 bg-background/80 relative flex w-full max-w-xs flex-col gap-1 rounded-2xl border p-5 text-left shadow-inner">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">Astăzi</span>
                  <span className="text-foreground text-2xl font-semibold">
                    {format(today, 'd MMMM yyyy', { locale: ro })}
                  </span>
                  <span className="text-muted-foreground/80 text-sm">
                    {format(today, 'EEEE', { locale: ro })}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {highlightCards.map((card) => (
                  <div
                    key={card.id}
                    className="border-border/60 bg-background/70 group relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                  >
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                      {card.label}
                    </span>
                    <span
                      className={cn(
                        'text-foreground font-semibold',
                        card.id === 'next' ? 'text-lg leading-tight' : 'text-2xl'
                      )}
                    >
                      {card.value}
                    </span>
                    <span className="text-muted-foreground text-xs leading-relaxed">{card.description}</span>
                    <span className="from-primary/20 via-transparent to-transparent pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>

        <DashboardSectionCard title="Prezentare generală" icon={<BarChartIcon />}>
            <div className="flex flex-wrap justify-start gap-4 sm:justify-center">
              <OverviewCards />
            </div>
            </DashboardSectionCard>

          <DashboardSectionCard title="Evenimente" icon={<CalendarCheckIcon />} className="border-dashed border-border/70">
            <div className="flex flex-col gap-6 overflow-hidden lg:flex-row">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm lg:w-[360px]">
                <EventCalendar
                  selected={selectedDay}
                  onSelect={setSelectedDay}
                  onDoubleClick={handleDayDoubleClick}
                  highlightDates={computeHighlightDates(evenimente)}
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
                  <EventList events={eventsInDay} onEdit={handleEditEvent} onDelete={handleDelete} />
                </div>
              </div>
            </div>
          </DashboardSectionCard>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <DashboardSectionCard title="Acțiuni rapide" icon={<FlashlightIcon />}>
                <QuickActions />
              </DashboardSectionCard>

            <DashboardSectionCard title="Navigare" icon={<CompassIcon />}>
                <NavigationShortcuts />
              </DashboardSectionCard>
            </div>

            <DashboardSectionCard title="Activitate recentă" icon={<Clock4Icon />} className="flex h-[420px] flex-col">
              <RecentUpdates />
            </DashboardSectionCard>
          </div>

          <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
            <DialogContent className="sm:max-w-xl">
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
