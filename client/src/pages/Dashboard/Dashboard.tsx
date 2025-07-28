"use client";

import DashboardSectionCard from "@layouts/components/DashboardSectionCard";
import NavigationShortcuts from "./sections/NavigationShortcuts";
import OverviewCards from "./sections/OverviewCards";
import QuickActions from "./sections/QuickActions";
import RecentUpdates from "./sections/RecentUpdates";
import { EventCalendar, EventList, EventForm } from "@/features/events";
import {
  addDays,
  addWeeks,
  addMonths,
  differenceInCalendarDays,
  startOfDay,
} from "date-fns";
import {
  fetchEvenimente,
  createEveniment,
  deleteEveniment,
  updateEveniment,
  type Eveniment,
  type EvenimentData,
} from "@/features/events";
import {
  BarChartIcon,
  FlashlightIcon,
  CompassIcon,
  Clock4Icon,
  CalendarCheckIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Container from "@/components/Container";

function occursOn(event: Eveniment, day: Date) {
  const eventDate = startOfDay(new Date(event.data));
  const target = startOfDay(day);
  if (target < eventDate) return false;
  switch (event.recurrence) {
    case "daily":
      return true;
    case "weekly":
      return differenceInCalendarDays(target, eventDate) % 7 === 0;
    case "monthly":
      return eventDate.getDate() === target.getDate();
    default:
      return eventDate.getTime() === target.getTime();
  }
}

function computeHighlightDates(events: Eveniment[]) {
  const today = startOfDay(new Date());
  const end = addMonths(today, 3);
  const dates: Date[] = [];
  events.forEach((e) => {
    let current = startOfDay(new Date(e.data));
    while (current <= end) {
      dates.push(current);
      switch (e.recurrence) {
        case "daily":
          current = addDays(current, 1);
          break;
        case "weekly":
          current = addWeeks(current, 1);
          break;
        case "monthly":
          current = addMonths(current, 1);
          break;
        default:
          current = addMonths(end, 1);
          break;
      }
    }
  });
  return dates;
}

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const [evenimente, setEvenimente] = useState<Eveniment[]>([]);
  const [editing, setEditing] = useState<Eveniment | null>(null);
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  

  useEffect(() => {
    fetchEvenimente()
      .then(setEvenimente)
      .catch(console.error);
  }, []);

  const handleCreate = async (data: EvenimentData) => {
   const nou = await createEveniment(data);
    setEvenimente((prev) => [...prev, nou]);
    setShowFormModal(false);
  };

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
     if (id === null) return;
    const updated = await updateEveniment(id, data);
    setEvenimente((prev) =>
      prev.map((e) => (e.id === id ? updated : e))
    );
    setEditing(null);
    setShowFormModal(false);
  };

  const handleDelete = async (id: number) => {
    await deleteEveniment(id);
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
    (e) => selectedDay && occursOn(e, selectedDay)
  );

  return (
    <Container className="py-6">
      <div className="flex flex-col gap-8">
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
              highlightDates={computeHighlightDates(evenimente)}
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

  <DashboardSectionCard
  title="Activitate recentă"
  icon={<Clock4Icon />}
  className="p-4 h-64 flex flex-col"
>
  <RecentUpdates />
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
    </Container>
  );
}
