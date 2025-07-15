"use client";

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
import {
  BarChartIcon,
  FlashlightIcon,
  CompassIcon,
  Clock4Icon,
  CalendarCheckIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [evenimente, setEvenimente] = useState<Eveniment[]>([]);
  const [editing, setEditing] = useState<Eveniment | null>(null);
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
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
    setShowFormModal(false);
  };

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
    if (!token || id === null) return;
    const updated = await updateEveniment(id, data, token);
    setEvenimente((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );
    setEditing(null);
    setShowFormModal(false);
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    await deleteEveniment(id, token);
    setEvenimente((prev) => prev.filter((e) => e.id !== id));
  };

  const handleDayDoubleClick = (date: Date) => {
    setFormDate(date);
    setEditing(null);
    setShowFormModal(true);
  };

  const handleEditEvent = (event: Eveniment) => {
    setFormDate(new Date(event.data));
    setEditing(event);
    setShowFormModal(true);
  };

  const eventsInDay = evenimente.filter(
    (e) => new Date(e.data).toDateString() === selectedDay?.toDateString()
  );

  return (
    <div className="flex flex-col gap-8 p-6">
      <DashboardSectionCard title="Prezentare generală" icon={<BarChartIcon />}>
        <div className="flex flex-wrap gap-4 justify-start sm:justify-center">
          <OverviewCards />
        </div>
      </DashboardSectionCard>

      <DashboardSectionCard title="Evenimente" icon={<CalendarCheckIcon />} className="p-4">
        <div className="flex flex-col lg:flex-row gap-6 overflow-hidden">
          <div className="lg:w-[360px]">
            <EventCalendar
              selected={selectedDay}
              onSelect={setSelectedDay}
              onDoubleClick={handleDayDoubleClick}
              highlightDates={evenimente.map((e) => new Date(e.data))}
            />
          </div>
          <div className="flex-1 space-y-4">
            <EventList
              events={eventsInDay}
              onEdit={handleEditEvent}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </DashboardSectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DashboardSectionCard title="Acțiuni rapide" icon={<FlashlightIcon />}>
            <QuickActions />
          </DashboardSectionCard>

          <DashboardSectionCard title="Navigare" icon={<CompassIcon />}>
            <NavigationShortcuts />
          </DashboardSectionCard>
        </div>

        <DashboardSectionCard title="Activitate recentă" icon={<Clock4Icon />} className="p-4">
          <div className="max-h-[200px] overflow-y-auto text-sm">
            <RecentUpdates />
          </div>
        </DashboardSectionCard>
      </div>

      <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
        <DialogContent>
          {formDate && (
            <EventForm
              selectedDay={formDate}
              initial={editing}
              onSave={editing ? handleUpdate : (_id, data) => handleCreate(data)}
              onCancel={() => setShowFormModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
