import { useState, memo } from "react";
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
import { useAngajati } from "@/services/angajatiService";
import type { ModalPredaEchipamentProps } from "@/features/echipamente/types";

function ModalPredaEchipament({ echipament, onClose, onSubmit }: ModalPredaEchipamentProps) {
  const { data: angajati = [] } = useAngajati();
  const [angajatId, setAngajatId] = useState<string>("");
  
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

export default memo(ModalPredaEchipament);