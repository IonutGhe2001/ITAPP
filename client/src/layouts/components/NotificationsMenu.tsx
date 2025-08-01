import { FaBell } from "react-icons/fa";
import { UserIcon, MonitorIcon, PhoneIcon, TrashIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/context/use-notifications";

const updateIcons = {
  Echipament: <MonitorIcon className="w-4 h-4" />,
  Coleg: <UserIcon className="w-4 h-4" />,
  SIM: <PhoneIcon className="w-4 h-4" />,
};

export default function NotificationsMenu() {
  const { notifications, markAllRead, removeNotification, clearRead } =
    useNotifications();
  const importantNotifications = notifications.filter(
    (n) => n.importance === "high"
  );
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
        <Button variant="ghost" size="icon" className="relative hover:bg-muted">
          <FaBell className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        {importantNotifications.length === 0 ? (
          <DropdownMenuItem disabled>Nu există notificări</DropdownMenuItem>
        ) : (
          importantNotifications.map((n) => (
            <DropdownMenuItem key={n.id} className="flex gap-3 items-start">
              <div className="mt-1">{updateIcons[n.type]}</div>
              <div className="flex flex-col flex-1">
                <span className="text-sm">{n.message}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.timestamp), {
                    addSuffix: true,
                    locale: ro,
                  })}
                </span>
              </div>
              <button onClick={() => removeNotification(n.id)} className="ml-auto">
                <TrashIcon className="w-4 h-4 text-primary hover:text-primary-dark" />
              </button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}