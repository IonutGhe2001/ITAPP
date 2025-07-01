import { CalendarDaysIcon } from "lucide-react";

export default function CalendarSection() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow h-full">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Calendar</h2>
      <div className="flex flex-col items-center justify-center text-gray-400 h-full py-10">
        <CalendarDaysIcon className="w-12 h-12 mb-2" />
        <p className="text-sm">Integrare calendar in curs...</p>
      </div>
    </div>
  );
}
