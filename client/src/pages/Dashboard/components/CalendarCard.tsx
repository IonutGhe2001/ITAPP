import { useMemo, useRef } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { CalendarEvent, CalendarEventInput } from '../api';
import { EventList, type EventListHandle } from './EventList';
import { MiniCalendar } from './MiniCalendar';

interface CalendarCardProps {
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
}

export function CalendarCard({
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
}: CalendarCardProps) {
  const eventListRef = useRef<EventListHandle>(null);

  const selectedDayLabel = useMemo(
    () => format(selectedDate, "d MMMM yyyy", { locale: ro }),
    [selectedDate]
  );

  return (
    <Card className="h-auto w-full self-start border border-border/80 bg-card/90 shadow-sm">
      <CardHeader className="flex items-center justify-between gap-4 border-b border-border/60 pb-5">
        <CardTitle className="text-lg font-semibold text-foreground">Calendar</CardTitle>
        <Button
          type="button"
          size="sm"
          className="gap-1"
          onClick={() => eventListRef.current?.openCreateDialog()}
        >
          <Plus className="size-4" aria-hidden />
          Adaugă
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[220px_1fr]">
          <div className="rounded-xl border border-border/60 bg-background/60 p-4 shadow-sm">
            <MiniCalendar
              events={events}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onMonthChange={onMonthChange}
              onSelectDate={onSelectDate}
              isLoading={isLoading}
            />
          </div>
          <div className="space-y-5 rounded-xl border border-border/60 bg-background/60 p-5 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground md:text-base">{selectedDayLabel}</p>
              <p className="text-xs text-muted-foreground md:text-sm">Evenimente planificate pentru această zi.</p>
            </div>
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