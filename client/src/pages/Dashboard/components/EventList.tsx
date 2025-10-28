import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ro } from 'date-fns/locale';
import { CalendarDays, Clock, MapPin, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

  const formattedDate = useMemo(() => format(date, 'd MMMM yyyy', { locale: ro }), [date]);

  const openCreateDialog = () => {
    setMode('create');
    setForm({ date: format(date, 'yyyy-MM-dd'), title: '', time: '', location: '', description: '' });
    setIsDialogOpen(true);
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
  };

  const resetForm = () => {
    setForm({ date: format(date, 'yyyy-MM-dd'), title: '', time: '', location: '', description: '' });
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
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

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="sr-only">
        <p>{formattedDate}</p>
        <p>Evenimente pentru această zi.</p>
      </div>

      {isLoading ? (
        <div className="space-y-2" aria-hidden>
          {skeletonItems.map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg border border-border bg-muted/40" />
          ))}
        </div>
      ) : events.length ? (
        <ul className="max-h-[340px] space-y-2 overflow-y-auto pr-1" aria-live="polite">
          {events.map((event) => {
            const isDeleting = deletingId === event.id;
            return (
              <li
                key={event.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-border/70 bg-card/70 p-4"
                aria-busy={isDeleting}
              >
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">{event.title}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-4 text-muted-foreground" aria-hidden />
                      {event.time ?? 'Toată ziua'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-4 text-muted-foreground" aria-hidden />
                      {event.location ?? 'Locație în curs de confirmare'}
                    </span>
                  </div>
                  {event.description ? (
                    <p className="text-xs text-muted-foreground/90">{event.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(event)}
                    aria-label={`Editează ${event.title}`}
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
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </Button>
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
              <Input
                id="event-date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((state) => ({ ...state, date: event.target.value }))}
                required
              />
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
                <Input
                  id="event-time"
                  type="time"
                  value={form.time ?? ''}
                  onChange={(event) => setForm((state) => ({ ...state, time: event.target.value }))}
                />
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