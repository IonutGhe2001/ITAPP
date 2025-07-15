"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { UserIcon, MonitorIcon, PhoneIcon } from "lucide-react";

const updateIcons = {
  Echipament: <MonitorIcon className="w-4 h-4" />,
  Coleg: <UserIcon className="w-4 h-4" />,
  SIM: <PhoneIcon className="w-4 h-4" />,
};

type Update = {
  id: number;
  type: "Coleg" | "Echipament" | "SIM";
  message: string;
  timestamp: Date;
};

const updates: Update[] = [
  {
    id: 1,
    type: "Echipament",
    message: "Echipament adăugat: Laptop ASUS",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    type: "Coleg",
    message: "Coleg nou: Ionuț G.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 3,
    type: "SIM",
    message: "SIM asociat telefonului",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
];

export default function RecentUpdates() {
  const [filter] = useState<string | null>(null);

  const filteredUpdates = updates.filter((u) =>
    filter ? u.type.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <ul className="space-y-4">
      {filteredUpdates.map((update) => (
        <li
          key={update.id}
          className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
            {updateIcons[update.type]}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{update.type}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(update.timestamp, { addSuffix: true, locale: ro })}
              </span>
            </div>
            <p className="text-sm text-foreground leading-tight">
              {update.message}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}