"use client";

import DashboardSectionCard from "@layouts/components/DashboardSectionCard";
import NavigationShortcuts from "./sections/NavigationShortcuts";
import OverviewCards from "./sections/OverviewCards";
import QuickActions from "./sections/QuickActions";
import RecentUpdates from "./sections/RecentUpdates";
import { EventCalendar, EventList, EventForm } from "@/features/events";
import {
  BarChartIcon,
  FlashlightIcon,
  CompassIcon,
  Clock4Icon,
  CalendarCheckIcon,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Container from "@/components/Container";

import { computeHighlightDates } from "./utils";
import { useDashboardEvents } from "./useDashboardEvents";

export default function Dashboard() {
  const {
    selectedDay,
    setSelectedDay,
    eventsInDay,
    evenimente,
    editing,
    formDate,
    showFormModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDayDoubleClick,
    handleEditEvent,
    setShowFormModal,
  } = useDashboardEvents();

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
              <EventList events={eventsInDay} onEdit={handleEditEvent} onDelete={handleDelete} />
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

          <DashboardSectionCard title="Activitate recentă" icon={<Clock4Icon />} className="p-4 h-64 flex flex-col">
            <RecentUpdates />
          </DashboardSectionCard>
        </div>

<Dialog open={showFormModal} onOpenChange={setShowFormModal}>
          <DialogContent>
            {formDate && (
              <EventForm
                selectedDay={formDate}
                initial={editing}
                onSave={editing ? handleUpdate : (_id: number | null, data) => handleCreate(data)}
                onCancel={() => setShowFormModal(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
}
