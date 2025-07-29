import { createContext } from "react";

export type Notification = {
  id: string;
  type: "Coleg" | "Echipament" | "SIM";
  message: string;
  timestamp: string | Date;
  read: boolean;
};

export type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
};

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);