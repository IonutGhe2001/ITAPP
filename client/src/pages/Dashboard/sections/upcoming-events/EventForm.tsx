import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast/useToast";
import type { Eveniment, EvenimentData } from "@/services/evenimenteService";

type EventFormProps = {
  selectedDay: Date;
  initial: Eveniment | null;
  onSave: (id: number | null, data: EvenimentData) => void;
  onCancel: () => void;
};

export default function EventForm({
  selectedDay,
  initial,
  onSave,
  onCancel,
}: EventFormProps) {
  const [titlu, setTitlu] = useState("");
  const [ora, setOra] = useState("");
  const { toast } = useToast();

 useEffect(() => {
  console.log("Loaded initial event:", initial);
  if (initial) {
    setTitlu(initial.titlu);
    setOra(initial.ora);
  } else {
    setTitlu("");
    setOra("");
  }
}, [initial]);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Submitting form", {
    id: initial?.id,
    titlu,
    ora,
    data: selectedDay,
  });

  if (!titlu.trim() || !ora) {
    toast({
      title: "Câmpuri incomplete",
      description: "Completează titlul și ora pentru a salva evenimentul.",
    });
    return;
  }

  const data = { titlu, ora, data: selectedDay };
  onSave(initial?.id ?? null, data);
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-6 border border-border bg-muted rounded-xl shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="titlu">Titlu eveniment</Label>
        <Input
          id="titlu"
          type="text"
          placeholder="Ex: Ședință echipă"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ora">Ora</Label>
        <Input
          id="ora"
          type="time"
          value={ora}
          onChange={(e) => setOra(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {initial && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Anulează
          </Button>
        )}
        <Button type="submit">
          {initial ? "Salvează modificările" : "Adaugă eveniment"}
        </Button>
      </div>
    </form>
  );
}