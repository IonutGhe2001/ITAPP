'use client';

import { useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import api from '@/services/api';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { UserIcon, MonitorIcon, PhoneIcon, AlertTriangleIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { cn } from '@/lib/utils';

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
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

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
    if (baseUrl) {
      const url = baseUrl.replace(/\/api$/, '');
      socket = io(url, { withCredentials: true });

    socket.on('update', (update: Update) => {
        toastRef.current({ title: update.type, description: update.message });
        setUpdates((prev) => [update, ...prev]);
      });

      socket.on('connect_error', fetchUpdates);
      socket.on('disconnect', fetchUpdates);
    }
    return () => {
      socket?.disconnect();
    };
  // toastRef keeps the latest toast function, so we only need to set up once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUpdates = updates.filter((u) =>
    filter ? u.type.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        className="bg-border/60 absolute bottom-6 left-6 top-6 hidden w-px lg:block"
        aria-hidden
      />
      <ul className="flex flex-col gap-4 overflow-y-auto pr-1">
        {filteredUpdates.length === 0 && (
          <li className="text-muted-foreground text-sm">Nu există activitate recentă.</li>
        )}
        {filteredUpdates.map((update) => {
          const isImportant = update.importance === 'high';
          return (
            <li
              key={update.id}
              className={cn(
                'border-border/60 bg-background/80 hover:border-primary/40 group relative flex gap-4 rounded-2xl border p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg',
                isImportant && 'border-primary/50 bg-primary/5'
              )}
            >
              <span className="from-primary/20 via-primary/0 pointer-events-none absolute left-[18px] top-0 hidden h-full w-px bg-gradient-to-b to-transparent lg:block" />
              <span
                className="bg-primary/60 absolute left-3 top-6 hidden h-3 w-3 rounded-full lg:block"
                aria-hidden
              />
              <div className="bg-muted/70 text-primary ring-border/50 flex h-11 w-11 items-center justify-center rounded-xl shadow-inner ring-1">
                {updateIcons[update.type]}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(isImportant && 'border-destructive/60 text-destructive')}
                  >
                    {update.type}
                  </Badge>
                  {isImportant && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangleIcon className="h-3 w-3" /> Prioritar
                    </Badge>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(update.timestamp), {
                      addSuffix: true,
                      locale: ro,
                    })}
                  </span>
                </div>
                <p className="text-foreground text-sm leading-relaxed">{update.message}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
