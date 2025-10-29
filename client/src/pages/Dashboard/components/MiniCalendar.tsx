import { useMemo } from 'react';
import { addDays, endOfMonth, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { ro } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '../api';

interface MiniCalendarProps {
  events: CalendarEvent[];
  currentMonth: Date;
  selectedDate: Date;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
  isLoading?: boolean;
}

const weekdayReference = startOfWeek(new Date(2024, 0, 1), { locale: ro, weekStartsOn: 1 });
const weekdays = Array.from({ length: 7 }, (_, index) =>
  format(addDays(weekdayReference, index), 'EE', { locale: ro })
);

export function MiniCalendar({ events, currentMonth, selectedDate, onMonthChange, onSelectDate, isLoading }: MiniCalendarProps) {
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
    const start = startOfWeek(startOfMonth(currentMonth), { locale: ro, weekStartsOn: 1 });
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [currentMonth]);

  const handlePrevMonth = () => onMonthChange(startOfMonth(addDays(currentMonth, -1)));
  const handleNextMonth = () => onMonthChange(startOfMonth(addDays(endOfMonth(currentMonth), 1)));

  const handleSelectDay = (day: Date) => {
    onSelectDate(day);
    if (!isSameMonth(day, currentMonth)) {
      onMonthChange(startOfMonth(day));
    }
  };

  return (
    <div className="space-y-5" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">
          {format(currentMonth, 'MMMM yyyy', { locale: ro })}
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={handlePrevMonth}
            aria-label="Luna precedentă"
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={handleNextMonth}
            aria-label="Luna următoare"
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-7 animate-pulse rounded-md bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-7 place-items-center gap-2 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {weekdays.map((day, index) => (
              <span key={index} className="w-9 text-center md:w-10">
                {day}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 place-items-center gap-2">
            {visibleDays.map((day) => {
              const key = format(day, 'yyyy-MM-dd');
              const hasEvents = Boolean(eventsByDate[key]?.length);
              const active = isSameDay(day, selectedDate);
              const inMonth = isSameMonth(day, currentMonth);
              const current = isToday(day);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  aria-selected={active}
                  aria-current={current ? 'date' : undefined}
                  className={cn(
                    'relative inline-flex size-9 items-center justify-center rounded-md text-xs font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:size-10 aria-selected:bg-primary aria-selected:text-primary-foreground',
                    inMonth ? 'text-foreground' : 'text-muted-foreground/60',
                    active && 'bg-primary text-primary-foreground',
                    !active && current && 'bg-primary/10 font-semibold text-primary ring-1 ring-primary/40'
                  )}
                >
                  {format(day, 'd')}
                  {!active && hasEvents ? (
                    <span className="absolute -bottom-1 inline-flex h-1.5 w-1.5 rounded-full bg-muted-foreground/80" aria-hidden />
                  ) : null}
                  {active ? (
                    <span className="absolute -bottom-1 inline-flex h-1.5 w-1.5 rounded-full bg-primary-foreground/80" aria-hidden />
                  ) : null}
                  {current ? <span className="sr-only">Astăzi</span> : null}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}