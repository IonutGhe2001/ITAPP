import { useState, useEffect, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast/useToast";
import type { Eveniment, EvenimentData } from "@/services/evenimenteService";

const ORA_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

type Props = {
  selectedDay: Date;
  initial: Eveniment | null;
  onSave: (id: number | null, data: EvenimentData) => void;
  onCancel: () => void;
};

const EventForm: FC<Props> = ({ selectedDay, initial, onSave, onCancel }) => {
  const [titlu, setTitlu] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const { toast } = useToast();

  useEffect(() => {
    if (initial) {
      setTitlu(initial.titlu);
      if (initial.ora) {
        const [start, end] = initial.ora.split("-");
        setStartTime(start);
        setEndTime(end);
        setAllDay(false);
      } else {
        setAllDay(true);
      }
      setRecurrence(initial.recurrence ?? "none");
    } else {
      setTitlu("");
      setStartTime("");
      setEndTime("");
      setAllDay(false);
      setRecurrence("none");
    }
  }, [initial]);

  const isValidInterval = (start: string, end: string) => {
    return start < end;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titlu || (!allDay && (!startTime || !endTime))) {
      toast({
        title: "Completare necesară",
        description: "Te rugăm să completezi toate câmpurile.",
        variant: "destructive",
      });
      return;
    }

    if (!allDay && !isValidInterval(startTime, endTime)) {
      toast({
        title: "Interval invalid",
        description: "Ora de început trebuie să fie înaintea celei de sfârșit.",
        variant: "destructive",
      });
      return;
    }

    const ora = allDay ? "" : `${startTime}-${endTime}`;
    const data: EvenimentData = {
      titlu,
      ora,
      data: selectedDay,
      recurrence,
    };

    onSave(initial?.id ?? null, data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="titlu">Titlu eveniment</Label>
        <Input
          id="titlu"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          placeholder="Ex: Ședință echipă"
        />
      </div>

      <div className="flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          id="allDay"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
          className="accent-primary w-4 h-4"
        />
        <Label htmlFor="allDay" className="text-sm font-medium">
          <span className="transition-colors text-muted-foreground hover:text-foreground">
            Eveniment toată ziua
          </span>
        </Label>
      </div>

      {!allDay && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="start">De la</Label>
            <input
              list="time-options"
              id="start"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="end">Până la</Label>
            <input
              list="time-options"
              id="end"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <datalist id="time-options">
            {ORA_OPTIONS.map((opt) => (
              <option key={opt} value={opt} />
            ))}
          </datalist>
        </div>
      )}

<div>
        <Label htmlFor="recurrence">Recurență</Label>
        <select
          id="recurrence"
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value as any)}
          className="border rounded px-3 py-2 w-full"
        >
          <option value="none">O singură dată</option>
          <option value="daily">Zilnic</option>
          <option value="weekly">Săptămânal</option>
          <option value="monthly">Lunar</option>
        </select>
      </div>
      
      <div className="flex justify-end gap-2 pt-2">
        {initial && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Renunță
          </Button>
        )}
        <Button type="submit">Salvează</Button>
      </div>
    </form>
  );
};

export default EventForm;