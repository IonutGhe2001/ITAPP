import { useContext } from 'react';
import { NotificationsContext, type NotificationsContextType } from './notifications-context';

export function useNotifications(): NotificationsContextType {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationsProvider');
  }
  return context;
}
