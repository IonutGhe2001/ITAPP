import EquipmentStats from "./EquipmentStats";
import EmployeeStats from "./EmployeeStats";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import CalendarSection from "./CalendarSection";
import QuickAccess from "./QuickAccess";

export default function Dashboard() {
  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="grid grid-cols-3 gap-6">
        {/* Col 1 */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <EquipmentStats />
            <EmployeeStats />
          </div>
          <QuickAccess />
          <QuickActions />
        </div>

        {/* Col 2 */}
        <div className="flex flex-col gap-6">
          <CalendarSection />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}