import { useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { CalendarEvent, CalendarEventInput } from '../api';
import { EventList, type EventListHandle } from './EventList';
import { MiniCalendar } from './MiniCalendar';

interface CalendarCompactProps {
  events: CalendarEvent[];
  eventsForSelectedDay: CalendarEvent[];
  currentMonth: Date;
  selectedDate: Date;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
  onCreate: (values: CalendarEventInput) => Promise<void>;
  onUpdate: (id: string, values: CalendarEventInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
  deletingId?: string | null;
  className?: string;
}

export function CalendarCompact({
  events,
  eventsForSelectedDay,
  currentMonth,
  selectedDate,
  onMonthChange,
  onSelectDate,
  onCreate,
  onUpdate,
  onDelete,
  isLoading,
  isSaving,
  deletingId,
  className,
}: CalendarCompactProps) {
  const eventListRef = useRef<EventListHandle>(null);

  const selectedDayLabel = useMemo(
    () => format(selectedDate, "d MMMM yyyy", { locale: ro }),
    [selectedDate]
  );

  return (
    <Card className={cn('flex min-h-[520px] w-full flex-col border border-border/80 bg-card/90 shadow-sm', className)}>
      <CardHeader className="flex items-center justify-between gap-3 space-y-0 border-b border-border/60 p-5">
        <CardTitle className="text-base font-semibold text-foreground sm:text-lg">Calendar</CardTitle>
        <Button
          type="button"
          size="sm"
          className="gap-2"
          onClick={() => eventListRef.current?.openCreateDialog()}
        >
          <Plus className="size-4" aria-hidden />
          Add
        </Button>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-5 p-5">
        <div className="grid h-full min-h-0 grid-cols-1 items-start gap-5 md:grid-cols-[240px_1fr]">
          <div className="rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm">
            <MiniCalendar
              events={events}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onMonthChange={onMonthChange}
              onSelectDate={onSelectDate}
              isLoading={isLoading}
            />
          </div>
          <div className="flex h-full min-h-0 flex-col gap-5 rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground md:text-base">{selectedDayLabel}</p>
              <p className="text-xs text-muted-foreground md:text-sm">Evenimente planificate pentru această zi.</p>
            </div>
            <div className="flex-1 min-h-0">
              <EventList
                ref={eventListRef}
                date={selectedDate}
                events={eventsForSelectedDay}
                onCreate={onCreate}
                onUpdate={onUpdate}
                onDelete={onDelete}
                isLoading={isLoading}
                isSaving={isSaving}
                deletingId={deletingId}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}