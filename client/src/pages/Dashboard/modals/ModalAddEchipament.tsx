"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEchipament } from "@/services/echipamenteService";
import { getAngajati } from "@/services/angajatiService";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    getAngajati().then((res) => setAngajati(res.data));
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nume.trim()) newErrors.nume = "Numele este obligatoriu.";
    if (!formData.serie.trim()) newErrors.serie = "Seria este obligatorie.";
    if (!["laptop", "telefon", "sim"].includes(formData.tip)) newErrors.tip = "Tipul nu este valid.";
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
      onClose();
    } catch (err) {
      toast({ title: "Eroare", description: "Eroare la adăugare echipament.", variant: "destructive" });
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
            <Label htmlFor="nume">Nume</Label>
            <Input id="nume" value={formData.nume} onChange={(e) => setFormData({ ...formData, nume: e.target.value })} />
            {errors.nume && <p className="text-xs text-red-500 mt-1">{errors.nume}</p>}
          </div>
          <div>
            <Label htmlFor="serie">Serie</Label>
            <Input id="serie" value={formData.serie} onChange={(e) => setFormData({ ...formData, serie: e.target.value })} />
            {errors.serie && <p className="text-xs text-red-500 mt-1">{errors.serie}</p>}
          </div>
          <div>
            <Label htmlFor="tip">Tip</Label>
            <Select
              value={formData.tip}
              onValueChange={(value: string) => setFormData({ ...formData, tip: value })}
            >
              <SelectTrigger id="tip">
                <SelectValue placeholder="Selectează tipul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="telefon">Telefon</SelectItem>
                <SelectItem value="sim">SIM</SelectItem>
              </SelectContent>
            </Select>
            {errors.tip && <p className="text-xs text-red-500 mt-1">{errors.tip}</p>}
          </div>
          <div>
            <Label htmlFor="angajatId">Angajat asociat</Label>
            <Select
              value={formData.angajatId}
              onValueChange={(value: string) => setFormData({ ...formData, angajatId: value })}
            >
              <SelectTrigger id="angajatId">
                <SelectValue placeholder="Selectează colegul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Neasociat</SelectItem>
                {angajati.map((angajat) => (
                  <SelectItem key={angajat.id} value={angajat.id}>
                    {angajat.numeComplet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} className="w-full bg-primary text-white hover:bg-primary/90">
            Salvează
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
