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
  console.log("handleUpdate CALLED", { id, data });
  if (!token || id === null) {
    console.warn("Token sau ID invalid pentru update.");
    return;
  }
  try {
    const updated = await updateEveniment(id, data, token);
    setEvenimente((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );
    console.log("Eveniment actualizat cu succes:", updated);
    setEditing(null);
  } catch (err) {
    console.error("Eroare la actualizare:", err);
  }
};

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteEveniment(id, token);
    setEvenimente((prev) => prev.filter((e) => e.id !== id));
  };

  const handleEdit = (event: Eveniment) => {
    setEditing(event);
    setSelectedDay(new Date(event.data));
  };

  const eventsInDay = evenimente.filter(
    (e) =>
      new Date(e.data).toDateString() ===
      selectedDay?.toDateString()
  );

  return (
    <div className="space-y-6">
      <EventCalendar
        selected={selectedDay}
        onSelect={(date) => date && setSelectedDay(date)}
        highlightDates={evenimente.map(
          (e) => new Date(e.data)
        )}
      />
      <EventList
        events={eventsInDay}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EventForm
        selectedDay={selectedDay ?? new Date()}
        onSave={(id, data) =>
          id ? handleUpdate(id, data) : handleCreate(data)
        }
        initial={editing}
        onCancel={() => setEditing(null)}
      />
    </div>
  );
}