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
    if (!titlu || !ora) {
      toast({
        title: "Completare necesară",
        description: "Te rugăm să completezi toate câmpurile.",
        variant: "destructive",
      });
      return;
    }

    const data: EvenimentData = {
      titlu,
      ora,
      data: selectedDay,
    };
    onSave(initial?.id ?? null, data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      
    >
      <div className="space-y-2">
        <Label htmlFor="titlu">Titlu eveniment</Label>
        <Input
          id="titlu"
          value={titlu}
          onChange={(e) => setTitlu(e.target.value)}
          placeholder="Ex: Ședință echipă"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ora">Ora</Label>
        <Input
          id="ora"
          value={ora}
          onChange={(e) => setOra(e.target.value)}
          placeholder="Ex: 14:00"
        />
      </div>

    <div className="flex justify-end gap-3 pt-2">
  {initial && (
    <Button type="button" variant="ghost" onClick={onCancel}>
      Renunță
    </Button>
  )}
  <Button type="submit">
    Salvează
  </Button>
</div>
    </form>
  );
}