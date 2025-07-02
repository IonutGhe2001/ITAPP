import { ClockIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

export default function RecentActivity() {
  const now = new Date();
  const entries = [
    { message: "Echipament adăugat: Laptop ASUS", timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000) },
    { message: "Angajat adăugat: Ionut G.", timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000) },
    { message: "SIM asociat unui telefon", timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000) },
  ];

  return (
    <section aria-labelledby="recent-activity-heading">
      <h2 id="recent-activity-heading" className="text-sm font-semibold text-primary mb-4">
        Activitate recentă
      </h2>
      <ul className="flex flex-col gap-3 text-sm text-gray-700">
        {entries.map((entry, index) => (
          <li key={index} className="flex items-start gap-3">
            <ClockIcon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="truncate font-medium">{entry.message}</span>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(entry.timestamp, { addSuffix: true, locale: ro })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
