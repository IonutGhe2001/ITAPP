"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Badge } from "@components/ui/badge";

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

  const badgeVariant = {
    Echipament: "secondary",
    Coleg: "default",
    SIM: "outline",
  } as const;

  return (
    <ul className="space-y-2">
      {filteredUpdates.length > 0 ? (
        filteredUpdates.map((update) => (
          <li
            key={update.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-muted p-4 rounded-lg border border-border shadow-sm hover:shadow transition group"
          >
            <div>
              <p className="text-sm text-foreground group-hover:underline">
                {update.message}
              </p>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(update.timestamp, {
                  addSuffix: true,
                  locale: ro,
                })}
              </span>
            </div>
            <Badge variant={badgeVariant[update.type]}>{update.type}</Badge>
          </li>
        ))
      ) : (
        <div className="text-center text-muted-foreground text-sm py-4">
          Nu există update-uri recente. 🎉
        </div>
      )}
    </ul>
  );
}
