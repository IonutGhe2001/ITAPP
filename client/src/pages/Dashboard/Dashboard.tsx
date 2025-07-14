import DashboardSectionCard from "@/components/DashboardSectionCard";
import NavigationShortcuts from "./sections/NavigationShortcuts";
import OverviewCards from "./sections/OverviewCards";
import QuickActions from "./sections/QuickActions";
import RecentUpdates from "./sections/RecentUpdates";
import EventCalendar from "./sections/upcoming-events/EventCalendar";
import EventList from "./sections/upcoming-events/EventList";
import EventForm from "./sections/upcoming-events/EventForm";
import { useState, useEffect } from "react";
import {
  fetchEvenimente,
  createEveniment,
  deleteEveniment,
  updateEveniment,
  type Eveniment,
  type EvenimentData,
} from "@/services/evenimenteService";
import { useAuth } from "@/store/authStore";

export default function Dashboard() {
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
    <div className="flex flex-col gap-10 px-4 lg:px-0">
      {/* Secțiune 1: Sumar + Navigare + Acțiuni */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardSectionCard title="Statistici" icon="📊" className="md:col-span-3">
          <OverviewCards />
        </DashboardSectionCard>
        <DashboardSectionCard title="Navigare rapidă" icon="🚀">
          <NavigationShortcuts />
        </DashboardSectionCard>
        <DashboardSectionCard title="Acțiuni rapide" icon="⚡">
          <QuickActions />
        </DashboardSectionCard>
      </section>

      {/* Secțiune 2: Calendar + Evenimente */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <DashboardSectionCard title="Calendar" icon="📅">
          <EventCalendar
            selected={selectedDay}
            onSelect={(date) => date && setSelectedDay(date)}
            highlightDates={evenimente.map((e) => new Date(e.data))}
          />
        </DashboardSectionCard>
        <div className="lg:col-span-2 space-y-6">
          <DashboardSectionCard title="Evenimente" icon="🗓️">
            <EventList
              events={eventsInDay}
              onEdit={(e) => setEditing(e)}
              onDelete={handleDelete}
            />
          </DashboardSectionCard>
          <DashboardSectionCard title="Adaugă eveniment" icon="➕">
            <EventForm
              selectedDay={selectedDay ?? new Date()}
              onSave={(id, data) =>
                id ? handleUpdate(id, data) : handleCreate(data)
              }
              initial={editing}
              onCancel={() => setEditing(null)}
            />
          </DashboardSectionCard>
        </div>
      </section>

      {/* Secțiune 3: Activitate Recentă */}
      <section>
        <DashboardSectionCard title="Update-uri recente" icon="📌">
          <RecentUpdates />
        </DashboardSectionCard>
      </section>
    </div>
  );
}