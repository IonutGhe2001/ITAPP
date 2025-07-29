"use client";

import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import api from "@/services/api";
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
  id: string;
  type: "Coleg" | "Echipament" | "SIM";
  message: string;
  timestamp: string | Date;
};

export default function RecentUpdates() {
  const [filter] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    let socket: Socket | null = null;

    const fetchUpdates = async () => {
      try {
        const res = await api.get<Update[]>("/updates");
        setUpdates(res.data);
      } catch {
        // ignore
      }
    };

    fetchUpdates();

    const baseUrl =
      (import.meta as any).env.VITE_SOCKET_URL ||
      (import.meta as any).env.VITE_API_URL;
      const url = baseUrl.replace(/\/api$/, "");
    socket = io(url, { withCredentials: true });

    socket.on("update", (update: Update) => {
      setUpdates((prev) => [update, ...prev]);
    });

    socket.on("connect_error", fetchUpdates);
    socket.on("disconnect", fetchUpdates);

    return () => {
      socket?.disconnect();
    };
  }, []);


  const filteredUpdates = updates.filter((u) =>
    filter ? u.type.toLowerCase().includes(filter.toLowerCase()) : true
  );

 return (
    <div className="flex-1 overflow-y-auto min-h-0 w-full pr-1 space-y-4">
      <ul>
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
                  {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true, locale: ro })}
                </span>
              </div>
              <p className="text-sm text-foreground leading-tight">
                {update.message}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}