"use client";

import { useState } from "react";
import { ClockIcon, LaptopIcon, UsersIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const updates = [
  {
    id: 1,
    type: "Echipament",
    icon: <LaptopIcon className="w-6 h-6" />,
    message: "Echipament adăugat: Laptop ASUS",
    timestamp: new Date(new Date().getTime() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: "Coleg",
    icon: <UsersIcon className="w-6 h-6" />,
    message: "Coleg nou: Ionut G.",
    timestamp: new Date(new Date().getTime() - 4 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: "SIM",
    icon: <ClockIcon className="w-6 h-6" />,
    message: "SIM asociat telefonului",
    timestamp: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),
  },
  {
    id: 4,
    type: "Echipament",
    icon: <LaptopIcon className="w-6 h-6" />,
    message: "Echipament adăugat: Monitor Dell",
    timestamp: new Date(new Date().getTime() - 8 * 60 * 60 * 1000),
  },
  {
    id: 5,
    type: "Coleg",
    icon: <UsersIcon className="w-6 h-6" />,
    message: "Coleg nou: Ana M.",
    timestamp: new Date(new Date().getTime() - 12 * 60 * 60 * 1000),
  },
  {
    id: 6,
    type: "SIM",
    icon: <ClockIcon className="w-6 h-6" />,
    message: "SIM dezactivat",
    timestamp: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  },
];

export default function RecentUpdates() {
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(updates.length / perPage);
  const displayedActivities = updates.slice((page - 1) * perPage, page * perPage);

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
          📋 Activitate recentă
        </h2>
        <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ul className="flex flex-col gap-4">
        {displayedActivities.map((update) => (
          <li
            key={update.id}
            className="flex items-start gap-4 bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 shadow-inner">
              {update.icon}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-pink-600 text-lg">{update.message}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(update.timestamp, { addSuffix: true, locale: ro })}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="text-sm text-pink-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>
        <span className="text-sm text-muted-foreground">
          Pagina {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="text-sm text-pink-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Următor →
        </button>
      </div>
    </section>
  );
}
