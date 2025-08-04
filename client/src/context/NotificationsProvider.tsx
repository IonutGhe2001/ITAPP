import { useState, useEffect, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { NotificationsContext, type Notification } from './NotificationsProvider';
import { useAuth } from './useAuth';

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;
    let socket: Socket | null = null;

    const fetchNotifications = async () => {
      try {
        const res = await api.get<Omit<Notification, 'read'>[]>(
          '/updates?limit=10&importance=high'
        );
        setNotifications(res.data.map((n) => ({ ...n, read: true })));
      } catch {
        // ignore
      }
    };

    fetchNotifications();

    const baseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;
    const url = baseUrl.replace(/\/api$/, '');
    socket = io(url, {
      withCredentials: true,
      reconnectionAttempts: 5,
    });

    socket.on('notification', (update: Omit<Notification, 'read'>) => {
      const notification = { ...update, read: false };
      toast({ title: update.type, description: update.message });
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket?.disconnect();
    };
    // toast comes from a hook and is recreated on each render
    // but we only want to set up the socket when authenticated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        markAllRead,
        removeNotification,
        clearRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
