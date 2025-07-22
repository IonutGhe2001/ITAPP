"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEchipament } from "@/services/echipamenteService";
import { getAngajati } from "@/services/angajatiService";
import { useToast } from "@/hooks/use-toast/useToast";
import { useRefresh } from "@/context/useRefreshContext"; // ✅ nou

export default function ModalAddEchipament({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nume: "",
    serie: "",
    tip: "laptop",
    angajatId: "none",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [angajati, setAngajati] = useState<any[]>([]);
  const { toast } = useToast();
  const { triggerRefresh } = useRefresh(); 

  useEffect(() => {
    getAngajati()
      .then((res) => setAngajati(res.data))
      .catch((err) => console.error("Eroare la getAngajati:", err));
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nume.trim()) newErrors.nume = "Numele echipamentului este obligatoriu.";
    if (!formData.serie.trim()) newErrors.serie = "Seria este obligatorie.";
    if (!["laptop", "telefon", "sim"].includes(formData.tip)) newErrors.tip = "Selectează un tip valid.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      angajatId: formData.angajatId === "none" ? null : formData.angajatId,
    };

    try {
      await createEchipament(payload);
      toast({ title: "Echipament adăugat", description: "Echipamentul a fost salvat cu succes." });
      triggerRefresh(); // ✅ actualizează OverviewCards și altele
      onClose();
    } catch (err) {
      toast({
        title: "Eroare",
        description: "Eroare la adăugare echipament.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă echipament</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nume echipament</Label>
            <Input
              name="nume"
              value={formData.nume}
              onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
            />
            {errors.nume && <p className="text-sm text-red-500 mt-1">{errors.nume}</p>}
          </div>

          <div>
            <Label>Seria echipamentului</Label>
            <Input
              name="serie"
              value={formData.serie}
              onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
            />
            {errors.serie && <p className="text-sm text-red-500 mt-1">{errors.serie}</p>}
          </div>

          <div>
            <Label>Tip</Label>
            <Select
              value={formData.tip}
              onValueChange={(value) => setFormData({ ...formData, tip: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="telefon">Telefon</SelectItem>
                <SelectItem value="sim">Cartelă SIM</SelectItem>
              </SelectContent>
            </Select>
            {errors.tip && <p className="text-sm text-red-500 mt-1">{errors.tip}</p>}
          </div>

          <div>
            <Label>Angajat</Label>
            <Select
              value={formData.angajatId}
              onValueChange={(value) => setFormData({ ...formData, angajatId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Atribuie unui angajat (opțional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Neatribuit</SelectItem>
                {angajati.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.numeComplet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit}>Salvează</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
