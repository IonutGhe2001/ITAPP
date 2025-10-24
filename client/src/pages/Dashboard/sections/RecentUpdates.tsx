'use client';

import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import api from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { UserIcon, MonitorIcon, PhoneIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast/use-toast-hook';

const updateIcons = {
  Echipament: <MonitorIcon className="h-4 w-4" />,
  Coleg: <UserIcon className="h-4 w-4" />,
  SIM: <PhoneIcon className="h-4 w-4" />,
};

type Update = {
  id: string;
  type: 'Coleg' | 'Echipament' | 'SIM';
  message: string;
  timestamp: string | Date;
  importance: 'normal' | 'high';
};

export default function RecentUpdates() {
  const [filter] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    let socket: Socket | null = null;

    const fetchUpdates = async () => {
      try {
        const res = await api.get<Update[]>('/updates?limit=10');
        setUpdates(res.data);
      } catch {
        // ignore
      }
    };

    fetchUpdates();

    const baseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    const url = baseUrl.replace(/\/api$/, '');
    socket = io(url, { withCredentials: true });

    socket.on('update', (update: Update) => {
      toast({ title: update.type, description: update.message });
      setUpdates((prev) => [update, ...prev]);
    });

    socket.on('connect_error', fetchUpdates);
    socket.on('disconnect', fetchUpdates);

    return () => {
      socket?.disconnect();
    };
  }, [toast]);

  const filteredUpdates = updates.filter((u) =>
    filter ? u.type.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="min-h-0 w-full flex-1 space-y-4 overflow-y-auto pr-1">
      <ul className="space-y-3">
        {filteredUpdates.map((update) => (
          <li
            key={update.id}
            className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-4 shadow-inner shadow-primary/5 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-muted/60 text-primary">
              {updateIcons[update.type]}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{update.type}</Badge>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true, locale: ro })}
                </span>
                {update.importance === 'high' && (
                  <Badge variant="destructive" className="text-[10px]">
                    important
                  </Badge>
                )}
              </div>
              <p className="text-foreground text-sm leading-tight">{update.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
