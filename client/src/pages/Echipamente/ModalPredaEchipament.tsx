import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAngajati } from "@/services/angajatiService";

export default function ModalPredaEchipament({
  echipament,
  onClose,
  onSubmit,
}: {
  echipament: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [angajati, setAngajati] = useState<any[]>([]);
  const [angajatId, setAngajatId] = useState<string>("");

  useEffect(() => {
    getAngajati()
      .then((res) => setAngajati(res.data))
      .catch((err) => console.error("Eroare la încărcare angajați:", err));
  }, []);

  const handleSubmit = () => {
    if (!angajatId) return alert("Selectează un angajat!");
    onSubmit({ ...echipament, angajatId, stare: "asignat" });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Predă echipamentul</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={angajatId} onValueChange={(val) => setAngajatId(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Selectează angajatul" />
            </SelectTrigger>
            <SelectContent>
              {angajati.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.numeComplet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="w-full" onClick={handleSubmit}>
            Confirmă predarea
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
