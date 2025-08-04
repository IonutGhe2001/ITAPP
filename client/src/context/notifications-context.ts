import { createContext } from 'react';

export type Notification = {
  id: string;
  type: 'Coleg' | 'Echipament' | 'SIM';
  message: string;
  timestamp: string | Date;
  importance: 'low' | 'medium' | 'high';
  read: boolean;
};

export type NotificationsContextType = {
  notifications: Notification[];
  markAllRead: () => void;
  removeNotification: (id: string) => void;
  clearRead: () => void;
};

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);
