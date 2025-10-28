import { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ro } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../api';
import { EmptyState } from './EmptyState';

interface MiniCalendarProps {
  events: CalendarEvent[];
  isLoading?: boolean;
}

const weekdayReference = startOfWeek(new Date(2024, 0, 1), { locale: ro, weekStartsOn: 1 });
const weekdays = Array.from({ length: 7 }, (_, index) =>
  format(addDays(weekdayReference, index), 'EE', { locale: ro })
);

export function MiniCalendar({ events, isLoading }: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const eventsByDate = useMemo(() => {
    const grouped = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
      const key = event.date;
      const list = acc[key] ?? [];
      list.push(event);
      acc[key] = list;
      return acc;
    }, {});
    return grouped;
  }, [events]);

  const visibleDays = useMemo(() => {
    const start = startOfWeek(currentMonth, { locale: ro, weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { locale: ro, weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const selectedKey = format(selectedDate, 'yyyy-MM-dd');
  const eventsForSelectedDay = useMemo(() => {
    const dayEvents = eventsByDate[selectedKey] ?? [];
    return [...dayEvents].sort((a, b) => {
      if (!a.time || !b.time) return (a.time ?? '').localeCompare(b.time ?? '');
      return a.time.localeCompare(b.time);
    });
  }, [eventsByDate, selectedKey]);

  const handlePrevMonth = () => setCurrentMonth((value) => subMonths(value, 1));
  const handleNextMonth = () => setCurrentMonth((value) => addMonths(value, 1));

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    setCurrentMonth(startOfMonth(day));
  };

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">{format(currentMonth, 'MMMM yyyy', { locale: ro })}</p>
          <p className="text-xs text-muted-foreground">Selectează o zi pentru a vedea evenimentele programate.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="Luna precedentă"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleNextMonth}
            aria-label="Luna următoare"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-8 animate-pulse rounded bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {weekdays.map((day, index) => (
              <span key={index}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-sm">
            {visibleDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const hasEvents = Boolean(eventsByDate[key]?.length);
              const active = isSameDay(day, selectedDate);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  aria-pressed={active}
                  className={cn(
                    'relative flex h-10 items-center justify-center rounded-md border border-transparent bg-card/60 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
                    active ? 'border-primary bg-primary/10 text-primary' : 'hover:border-border hover:bg-accent/30'
                  )}
                  data-today={isToday(day) ? 'true' : undefined}
                >
                  <span
                    className={
                      isSameMonth(day, currentMonth)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }
                  >
                    {format(day, 'd')}
                  </span>
                  {active ? <span className="absolute inset-x-1 bottom-1 h-1 rounded-full bg-primary" aria-hidden /> : null}
                  {!active && hasEvents ? (
                    <span className="absolute inset-x-2 bottom-1 h-1 rounded-full bg-muted-foreground/70" aria-hidden />
                  ) : null}
                  {isToday(day) ? <span className="sr-only">Astăzi</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <CalendarIcon className="h-4 w-4" aria-hidden />
          {format(selectedDate, 'd MMMM yyyy', { locale: ro })}
        </div>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-lg border border-border bg-muted/40" />
            ))}
          </div>
        ) : eventsForSelectedDay.length ? (
          <ul className="space-y-2 text-sm">
            {eventsForSelectedDay.map((event) => (
              <li key={event.id} className="flex items-start gap-3 rounded-lg border border-border bg-card/60 p-3">
                <Clock className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.time ? `${event.time} · ` : ''}
                    {event.location ?? 'Locație în curs de confirmare'}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Niciun eveniment în această zi"
            description="Planifică activități pentru a le vedea aici."
          />
        )}
      </div>
    </div>
  );
}