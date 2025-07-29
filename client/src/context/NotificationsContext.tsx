import { useState, useEffect, type ReactNode } from "react";
import { io, type Socket } from "socket.io-client";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import { NotificationsContext, type Notification } from "./notifications-context";

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  
  useEffect(() => {
    let socket: Socket | null = null;

    const fetchNotifications = async () => {
      try {
        const res = await api.get<Omit<Notification, 'read'>[]>("/updates");
        setNotifications(res.data.map((n) => ({ ...n, read: true })));
      } catch {
        // ignore
      }
    };

    fetchNotifications();

    const baseUrl =
      import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    const url = baseUrl.replace(/\/api$/, "");
    socket = io(url, {
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    socket.on("update", (update: Omit<Notification, 'read'>) => {
      const notification = { ...update, read: false };
      toast({ title: update.type, description: update.message });
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    });


    return () => {
      socket?.disconnect();
    };
   // toast comes from a hook and is recreated on each render
    // but we only want to set up the socket once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}