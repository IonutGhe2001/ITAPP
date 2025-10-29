import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CalendarDays, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

import type { CalendarEvent, CalendarEventInput } from '../api';
import { EmptyState } from './EmptyState';

export interface EventListHandle {
  openCreateDialog: () => void;
}

interface EventListProps {
  date: Date;
  events: CalendarEvent[];
  onCreate: (values: CalendarEventInput) => Promise<void>;
  onUpdate: (id: string, values: CalendarEventInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  isSaving?: boolean;
  deletingId?: string | null;
}

type FormMode = 'create' | 'edit';

type EventFormState = {
  id?: string;
  date: string;
  title: string;
  time?: string;
  location?: string;
  description?: string;
};

const skeletonItems = Array.from({ length: 3 });

const TIME_NONE_VALUE = 'all-day';

const TIME_OPTIONS = [
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
];

export const EventList = forwardRef<EventListHandle, EventListProps>(function EventList(
  { date, events, onCreate, onUpdate, onDelete, isLoading, isSaving, deletingId }: EventListProps,
  ref
) {
  const [mode, setMode] = useState<FormMode>('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<EventFormState>(() => ({
    date: format(date, 'yyyy-MM-dd'),
    title: '',
  }));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement | null>(null);

  const formattedDate = useMemo(() => format(date, 'd MMMM yyyy', { locale: ro }), [date]);

  const selectedDate = useMemo(() => {
    if (!form.date) {
      return undefined;
    }
    const parsed = parseISO(form.date);
    return isValid(parsed) ? parsed : undefined;
  }, [form.date]);

  const dateLabel = selectedDate
    ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ro })
    : 'Selectează data';

  const openCreateDialog = () => {
    setMode('create');
    setForm({ date: format(date, 'yyyy-MM-dd'), title: '', time: '', location: '', description: '' });
    setIsDialogOpen(true);
    setIsDatePickerOpen(false);
  };

  useImperativeHandle(ref, () => ({ openCreateDialog }));

  const openEditDialog = (event: CalendarEvent) => {
    setMode('edit');
    setForm({
      id: event.id,
      date: event.date,
      title: event.title,
      time: event.time ?? '',
      location: event.location ?? '',
      description: event.description ?? '',
    });
    setIsDialogOpen(true);
    setIsDatePickerOpen(false);
  };

  const resetForm = () => {
    setForm({ date: format(date, 'yyyy-MM-dd'), title: '', time: '', location: '', description: '' });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
    setIsDatePickerOpen(false);
  };

  const handleSubmit = async () => {
    const payload: CalendarEventInput = {
      date: form.date,
      title: form.title,
      time: form.time?.trim() ? form.time : undefined,
      location: form.location?.trim() ? form.location : undefined,
      description: form.description?.trim() ? form.description : undefined,
    };

    try {
      if (mode === 'create') {
        await onCreate(payload);
      } else if (form.id) {
        await onUpdate(form.id, payload);
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Nu am putut salva evenimentul', error);
    }
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  useEffect(() => {
    if (!isDatePickerOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDatePickerOpen]);

  useEffect(() => {
    if (!isDialogOpen) {
      setIsDatePickerOpen(false);
    }
  }, [isDialogOpen]);

  const handleDateSelect = (day?: Date) => {
    if (!day) {
      return;
    }

    setForm((state) => ({ ...state, date: format(day, 'yyyy-MM-dd') }));
    setIsDatePickerOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="sr-only">
        <p>{formattedDate}</p>
        <p>Evenimente pentru această zi.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3" aria-hidden>
          {skeletonItems.map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl border border-border/70 bg-muted/40" />
          ))}
        </div>
      ) : events.length ? (
        <ul className="flex h-full flex-col gap-4 overflow-y-auto pr-1.5" aria-live="polite">
          {events.map((event) => {
            const isDeleting = deletingId === event.id;
            const eventDateLabel = format(new Date(event.date), 'd MMMM yyyy', { locale: ro });
            return (
              <li
                key={event.id}
                className="group flex flex-col gap-4 rounded-xl border border-border/70 bg-card/80 p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                aria-busy={isDeleting}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-semibold text-foreground md:text-base">{event.title}</p>
                      <span className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden />
                        {event.time ?? 'Toată ziua'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground md:text-sm">
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="size-4" aria-hidden />
                        {event.location ?? 'Locație în curs de confirmare'}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-3.5" aria-hidden />
                        {eventDateLabel}
                      </span>
                    </div>
                    {event.description ? (
                      <p className="max-w-prose text-sm leading-relaxed text-muted-foreground/90">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2 self-start sm:self-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(event)}
                      aria-label={`Editează ${event.title}`}
                      className="transition-opacity group-hover:opacity-100 sm:opacity-80"
                    >
                      <Pencil className="size-4" aria-hidden />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                      aria-label={`Șterge ${event.title}`}
                      disabled={isDeleting}
                      className="transition-opacity group-hover:opacity-100 sm:opacity-80"
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          title="Nu sunt evenimente planificate"
          description="Adaugă rapid activități pentru această zi."
          icon={<CalendarDays className="h-5 w-5" />}
        />
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Adaugă eveniment' : 'Editează eveniment'}</DialogTitle>
            <DialogDescription>
              Completează detaliile evenimentului. Poți actualiza data, ora și persoanele implicate.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="event-date">Data</Label>
              <div className="relative" ref={datePickerRef}>
                <Button
                  id="event-date"
                  type="button"
                  variant="outline"
                  className={cn(
                    'w-full justify-between gap-2 text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                  onClick={() => setIsDatePickerOpen((state) => !state)}
                  aria-haspopup="dialog"
                  aria-expanded={isDatePickerOpen}
                >
                  <span className="line-clamp-1 flex-1 text-sm">{dateLabel}</span>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
                </Button>
                {isDatePickerOpen ? (
                  <div className="border-border bg-popover text-popover-foreground absolute left-0 right-0 z-50 mt-2 rounded-xl border p-3 shadow-lg">
                    <DayPicker
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      defaultMonth={selectedDate ?? new Date()}
                      showOutsideDays
                      locale={{ ...ro, options: { weekStartsOn: 1 } }}
                      className="mx-auto"
                      classNames={{
                        months: 'flex flex-col space-y-4',
                        month: 'space-y-4',
                        caption: 'flex items-center justify-between px-1',
                        caption_label: 'text-sm font-semibold text-foreground',
                        nav: 'flex items-center gap-1',
                        nav_button:
                          'border-border/70 text-muted-foreground hover:bg-muted/60 focus-visible:ring-ring flex h-8 w-8 items-center justify-center rounded-lg border bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        table: 'w-full border-collapse space-y-1',
                        head_row: 'flex',
                        head_cell: 'text-muted-foreground w-9 text-xs font-medium',
                        row: 'flex w-full',
                        cell: 'relative h-9 w-9 text-center text-sm focus-within:relative focus-within:z-20',
                        day: 'hover:bg-primary/10 focus-visible:ring-ring text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                        day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90',
                        day_today: 'text-primary font-semibold',
                        day_outside: 'text-muted-foreground/50',
                        day_disabled: 'text-muted-foreground/40',
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-title">Titlu</Label>
              <Input
                id="event-title"
                value={form.title}
                onChange={(event) => setForm((state) => ({ ...state, title: event.target.value }))}
                placeholder="Ex. Revizie inventar"
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-time">Ora</Label>
                <Select
                  value={form.time && form.time.trim() ? form.time : TIME_NONE_VALUE}
                  onValueChange={(value) =>
                    setForm((state) => ({
                      ...state,
                      time: value === TIME_NONE_VALUE ? '' : value,
                    }))
                  }
                >
                  <SelectTrigger id="event-time" className="h-10 justify-between">
                    <div className="flex w-full items-center gap-2 text-left">
                      <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
                      <SelectValue placeholder="Selectează ora" />
                    </div>
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-72">
                    <SelectItem value={TIME_NONE_VALUE}>Toată ziua</SelectItem>
                    {TIME_OPTIONS.map((timeOption) => (
                      <SelectItem key={timeOption} value={timeOption}>
                        {timeOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-location">Locație</Label>
                <Input
                  id="event-location"
                  value={form.location ?? ''}
                  onChange={(event) => setForm((state) => ({ ...state, location: event.target.value }))}
                  placeholder="Ex. Sala Atlas"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">Detalii</Label>
              <textarea
                id="event-description"
                value={form.description ?? ''}
                onChange={(event) => setForm((state) => ({ ...state, description: event.target.value }))}
                className={cn(
                  'min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                )}
                placeholder="Note adiționale pentru echipă"
              />
            </div>
            <DialogFooter className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving}>
                Anulează
              </Button>
              <Button type="submit" disabled={isSaving || !form.title.trim()}>
                {mode === 'create' ? 'Salvează eveniment' : 'Actualizează eveniment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
});