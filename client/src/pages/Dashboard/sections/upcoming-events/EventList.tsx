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
    <ul className="space-y-3">
      {events.map((event) => {
        const isToday = new Date(event.data).toDateString() === new Date().toDateString();

        return (
          <li
            key={event.id}
            className="flex justify-between items-start gap-4 p-4 bg-muted rounded-xl border border-border shadow-sm hover:shadow-md transition"
          >
            {/* Info eveniment */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
  {event.ora || format(new Date(event.data), "HH:mm")}
  {isToday && (
    <Badge className="ml-1 bg-primary/10 text-primary">Astăzi</Badge>
  )}
</span>
              <p className="text-sm font-medium text-foreground">{event.titlu}</p>
            </div>

            {/* Acțiuni */}
            <div className="flex gap-2 items-center mt-1">
              <button
                onClick={() => onEdit(event)}
                aria-label="Editează"
                className="rounded-md p-1 hover:bg-muted/70 transition text-muted-foreground hover:text-foreground"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(event.id)}
                aria-label="Șterge"
                className="rounded-md p-1 hover:bg-red-100 transition text-red-500 hover:text-red-600"
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
