import { ClockIcon } from "lucide-react";

export default function RecentActivity() {
  const entries = [
    "Echipament adăugat: Laptop ASUS - acum 2 ore",
    "Angajat adăugat: Maria T. - acum 3 ore",
    "SIM asociat unui telefon - acum 5 ore",
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
            <span className="truncate">{entry}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
