import EquipmentStats from "./EquipmentStats";
import EmployeeStats from "./EmployeeStats";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import CalendarSection from "./CalendarSection";
import QuickAccess from "./QuickAccess";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-background px-6 py-8 text-gray-900">
   
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 - Content */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
              <EquipmentStats />
            </div>
            <div className="rounded-2xl bg-white shadow-md p-6 border border-primary/10">
              <EmployeeStats />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="rounded-2xl bg-gradient-to-tr from-primary to-primary-dark text-white shadow-md p-6"
          >
            <QuickAccess />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-2xl bg-white shadow-md p-6 border border-primary/10"
          >
            <QuickActions />
          </motion.div>
        </section>

        {/* Col 2 - Sidebar */}
        <aside className="flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-2xl bg-white shadow-md p-6 border border-primary/10"
          >
            <CalendarSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="rounded-2xl bg-white shadow-md p-6 border border-primary/10"
          >
            <RecentActivity />
          </motion.div>
        </aside>
      </div>
    </main>
  );
}