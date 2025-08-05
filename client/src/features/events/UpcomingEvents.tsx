'use client';

import { useState } from 'react';
import {
  useEvenimente,
  useCreateEveniment,
  useDeleteEveniment,
  useUpdateEveniment,
  type Eveniment,
  type EvenimentData,
} from '@/features/events';

import EventCalendar from './components/upcoming-events/EventCalendar';
import EventList from './components/upcoming-events/EventList';
import EventForm from './components/upcoming-events/EventForm';
import DashboardSectionCard from '@layouts/components/DashboardSectionCard';
import { CalendarCheckIcon } from 'lucide-react';

export default function UpcomingEvents() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const { data: evenimente = [] } = useEvenimente();
  const createMutation = useCreateEveniment();
  const updateMutation = useUpdateEveniment();
  const deleteMutation = useDeleteEveniment();
  const [editing, setEditing] = useState<Eveniment | null>(null);

  const handleCreate = async (data: EvenimentData) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
    if (id === null) return;
    await updateMutation.mutateAsync({ id, data });
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const eventsInDay = evenimente.filter(
    (e) => new Date(e.data).toDateString() === selectedDay?.toDateString()
  );

  return (
    <DashboardSectionCard title="Evenimente" icon={<CalendarCheckIcon />} className="p-0">
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <EventCalendar
            selected={selectedDay}
            onSelect={setSelectedDay}
            highlightDates={evenimente.map((e) => new Date(e.data))}
          />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <EventList events={eventsInDay} onEdit={setEditing} onDelete={handleDelete} />
          <EventForm
            selectedDay={selectedDay || new Date()}
            initial={editing}
            onSave={
              editing
                ? handleUpdate
                : (_id: number | null, data: EvenimentData) => handleCreate(data)
            }
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}
