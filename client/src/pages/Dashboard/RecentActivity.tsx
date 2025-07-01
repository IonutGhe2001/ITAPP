import { ClockIcon } from "lucide-react";

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Activitate recentă</h2>
      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          Echipament adăugat: Laptop ASUS - acum 2 ore
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          Angajat adăugat: Maria T. - acum 3 ore
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          SIM asociat unui telefon - acum 5 ore
        </div>
      </div>
    </div>
  );
}
