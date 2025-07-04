import OverviewCards from "./sections/OverviewCards";
import QuickActions from "./sections/QuickActions";
import RecentUpdates from "./sections/RecentUpdates";
import NavigationShortcuts from "./sections/NavigationShortcuts";
import UpcomingEvents from "./sections/UpcomingEvents";
import DashboardSectionCard from "@/components/DashboardSectionCard";

export default function Dashboard() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 items-start">
        {/* Coloana principală */}
        <section className="flex flex-col gap-10">
          <OverviewCards />
          <DashboardSectionCard>
            <QuickActions />
          </DashboardSectionCard>
          <DashboardSectionCard>
            <RecentUpdates />
          </DashboardSectionCard>
        </section>

        {/* Coloana secundară */}
        <section className="flex flex-col gap-10">
          <DashboardSectionCard>
            <UpcomingEvents />
          </DashboardSectionCard>
          <DashboardSectionCard>
            <NavigationShortcuts />
          </DashboardSectionCard>
        </section>
      </div>
    </main>
  );
}
