"use client";

import { useEffect, useState } from "react";
import {
  fetchEvenimente,
  createEveniment,
  deleteEveniment,
  updateEveniment,
  type Eveniment,
  type EvenimentData,
} from "@/services/evenimenteService";
import { useAuth } from "@/store/authStore";

import EventCalendar from "./upcoming-events/EventCalendar";
import EventList from "./upcoming-events/EventList";
import EventForm from "./upcoming-events/EventForm";
import DashboardSectionCard from "@/components/DashboardSectionCard";
import { CalendarCheckIcon } from "lucide-react";

export default function UpcomingEvents() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [evenimente, setEvenimente] = useState<Eveniment[]>([]);
  const [editing, setEditing] = useState<Eveniment | null>(null);
  const token = useAuth((state) => state.token);

  useEffect(() => {
    if (!token) return;
    fetchEvenimente(token)
      .then(setEvenimente)
      .catch(console.error);
  }, [token]);

  const handleCreate = async (data: EvenimentData) => {
    if (!token) return;
    const nou = await createEveniment(data, token);
    setEvenimente((prev) => [...prev, nou]);
  };

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
    if (!token || id === null) return;
    const updated = await updateEveniment(id, data, token);
    setEvenimente((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteEveniment(id, token);
    setEvenimente((prev) => prev.filter((e) => e.id !== id));
  };

  const eventsInDay = evenimente.filter(
    (e) => new Date(e.data).toDateString() === selectedDay?.toDateString()
  );

  return (
    <DashboardSectionCard title="Evenimente" icon={<CalendarCheckIcon />} className="p-0">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-1">
          <EventCalendar
            selected={selectedDay}
            onSelect={setSelectedDay}
            highlightDates={evenimente.map((e) => new Date(e.data))}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <EventList
            events={eventsInDay}
            onEdit={setEditing}
            onDelete={handleDelete}
          />
          <EventForm
            selectedDay={selectedDay || new Date()}
            initial={editing}
            onSave={editing ? handleUpdate : (_id, data) => handleCreate(data)}
            onCancel={() => setEditing(null)}
          />
        </div>
      </div>
    </DashboardSectionCard>
  );
}
