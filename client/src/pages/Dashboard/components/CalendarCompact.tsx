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
    () => format(selectedDate, 'd MMMM yyyy', { locale: ro }),
    [selectedDate]
  );

  return (
    <Card
      className={cn(
        'border-border/80 bg-card/90 flex h-full min-h-[420px] w-full flex-col border shadow-sm',
        className
      )}
    >
      <CardHeader className="border-border/60 flex items-center justify-between gap-3 space-y-0 border-b p-6">
        <CardTitle className="text-foreground text-base font-semibold sm:text-lg">
          Calendar
        </CardTitle>
        <Button
          type="button"
          size="sm"
          className="gap-2"
          onClick={() => eventListRef.current?.openCreateDialog()}
        >
          <Plus className="size-4" aria-hidden />
          Adauga
        </Button>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-6 p-5 sm:p-6">
        <div className="border-border/60 bg-background/60 rounded-xl border p-5 shadow-sm">
          <MiniCalendar
            events={events}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            onMonthChange={onMonthChange}
            onSelectDate={onSelectDate}
            isLoading={isLoading}
          />
        </div>
        <div className="border-border/60 bg-background/60 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-xl border p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-foreground text-sm font-semibold md:text-base">{selectedDayLabel}</p>
            <p className="text-muted-foreground text-xs md:text-sm">
              Evenimente planificate pentru această zi.
            </p>
          </div>
          <div className="min-h-0 flex-1">
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
      </CardContent>
    </Card>
  );
}
