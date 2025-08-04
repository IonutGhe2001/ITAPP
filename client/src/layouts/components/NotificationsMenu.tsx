import { FaBell } from 'react-icons/fa';
import { UserIcon, MonitorIcon, PhoneIcon, TrashIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/context/useNotifications';

const updateIcons = {
  Echipament: <MonitorIcon className="h-4 w-4" />,
  Coleg: <UserIcon className="h-4 w-4" />,
  SIM: <PhoneIcon className="h-4 w-4" />,
};

export default function NotificationsMenu() {
  const { notifications, markAllRead, removeNotification, clearRead } = useNotifications();
  const importantNotifications = notifications.filter((n) => n.importance === 'high');
  const unreadCount = importantNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) {
          markAllRead();
        } else {
          clearRead();
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted relative">
          <FaBell className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="bg-destructive absolute right-1 top-1 h-2 w-2 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-96 w-80 overflow-y-auto">
        {importantNotifications.length === 0 ? (
          <DropdownMenuItem disabled>Nu există notificări</DropdownMenuItem>
        ) : (
          importantNotifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex items-start gap-3">
              <div className="mt-1">{updateIcons[n.type]}</div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm">{n.message}</span>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(n.timestamp), {
                    addSuffix: true,
                    locale: ro,
                  })}
                </span>
              </div>
              <button onClick={() => removeNotification(n.id)} className="ml-auto">
                <TrashIcon className="text-primary hover:text-primary-dark h-4 w-4" />
              </button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
