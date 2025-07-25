"use client";

import React, { useState, Suspense } from "react";
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
import type { Angajat } from "@/features/echipamente/types";
const ModalAddColeg = React.lazy(() => import("./ModalAddColeg"));
import { useCreateEchipament } from "@/services/echipamenteService";
import { useAngajati } from "@/services/angajatiService";
import { useToast } from "@/hooks/use-toast/useToast";


export default function ModalAddEchipament({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nume: "",
    serie: "",
     tip: "",
    angajatId: "none",
    metadata: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
   const { data: angajati = [] } = useAngajati();
  const [search, setSearch] = useState("");
  const [showColegModal, setShowColegModal] = useState(false);
  const createMutation = useCreateEchipament();
  const { toast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nume.trim()) newErrors.nume = "Numele echipamentului este obligatoriu.";
    if (!formData.serie.trim()) newErrors.serie = "Seria este obligatorie.";
    if (!formData.tip.trim()) newErrors.tip = "Tipul este obligatoriu.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      angajatId: formData.angajatId === "none" ? null : formData.angajatId,
      metadata: formData.metadata || undefined,
    };

    try {
      await createMutation.mutateAsync(payload);
      toast({
        title: "Echipament adăugat",
        description: "Echipamentul a fost salvat cu succes.",
      });
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
   <>
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
            <Input
              value={formData.tip}
             onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
            />
            {errors.tip && <p className="text-sm text-red-500 mt-1">{errors.tip}</p>}
          </div>

          <div>
            <Label>Detalii (opțional)</Label>
            <textarea
              className="border border-gray-300 rounded-lg w-full p-2 text-sm"
              value={formData.metadata}
              onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
            />
          </div>

          <div>
            <Label>Angajat</Label>
            <Input
              placeholder="Caută..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-2"
            />
            <Select
              value={formData.angajatId}
              onValueChange={(value) => setFormData({ ...formData, angajatId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Atribuie unui angajat (opțional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Neatribuit</SelectItem>
               {angajati
                  .filter((a: Angajat) =>
                    a.numeComplet.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((a: Angajat) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.numeComplet}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={() => setShowColegModal(true)}
              className="text-xs text-primary mt-1 hover:underline"
            >
              Adaugă coleg nou
            </button>
          </div>

          <Button onClick={handleSubmit}>Salvează</Button>
        </div>
      </DialogContent>
    </Dialog>
    <Suspense fallback={null}>
      {showColegModal && (
        <ModalAddColeg onClose={() => setShowColegModal(false)} />
      )}
    </Suspense>
    </>
  );
}
