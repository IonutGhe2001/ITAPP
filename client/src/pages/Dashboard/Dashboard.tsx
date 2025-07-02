import EquipmentStats from "./EquipmentStats";
import EmployeeStats from "./EmployeeStats";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import CalendarSection from "./CalendarSection";
import QuickAccess from "./QuickAccess";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-gray-900">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 - Content */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
              <EquipmentStats />
            </div>
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
              <EmployeeStats />
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-tr from-primary to-primary-dark text-white shadow-md p-6">
            <QuickAccess />
          </div>
          <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
            <QuickActions />
          </div>
        </section>

        {/* Col 2 - Sidebar */}
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
            <CalendarSection />
          </div>
          <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
            <RecentActivity />
          </div>
        </aside>
      </div>
    </main>
  );
}
