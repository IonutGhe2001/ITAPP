import { formatDistanceToNow } from "date-fns";
import { ro } from "date-fns/locale";

type UpdateItemProps = {
  icon: React.ReactNode;
  message: string;
  timestamp: Date;
};

export default function UpdateItem({
  icon,
  message,
  timestamp,
}: UpdateItemProps) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-none transition hover:bg-muted/50 rounded-lg px-2">
      <div className="mt-1 text-xl">{icon}</div>
      <div className="flex flex-col">
        <p className="text-sm text-foreground">{message}</p>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
            locale: ro,
          })}
        </span>
      </div>
    </div>
  );
}
