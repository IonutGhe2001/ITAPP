import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

type Eveniment = {
  id: number;
  titlu: string;
  ora: string;
  data: Date;
};

type EventListProps = {
  events: Eveniment[];
  onEdit: (event: Eveniment) => void;
  onDelete: (id: number) => void;
};

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  if (!events.length) {
    return (
      <div className="text-center text-muted-foreground text-sm py-6">
        Nu există evenimente pentru această zi. 💤
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => {
        const isToday = new Date(event.data).toDateString() === new Date().toDateString();

        return (
          <li
            key={event.id}
            className="flex justify-between items-start gap-4 p-4 bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{event.titlu}</h4>
                {isToday && <Badge variant="outline">Astăzi</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">Ora {format(new Date(event.data), "HH:mm")}</p>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onEdit(event)}
                className="text-muted-foreground hover:text-primary transition"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="text-muted-foreground hover:text-destructive transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
