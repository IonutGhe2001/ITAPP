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
import { updateEchipament } from "@/services/echipamenteService";
import { getAngajati } from "@/services/angajatiService";
import { useToast } from "@/hooks/use-toast/useToast";
import { useRefresh } from "@/context/useRefreshContext"; 
import type { ModalEditEchipamentProps } from "@/features/echipamente/types";

export default function ModalEditEchipament({
  echipament,
  onClose,
  onUpdated,
}: ModalEditEchipamentProps) {
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
    if (echipament) {
      setFormData({
        nume: echipament.nume || "",
        serie: echipament.serie || "",
        tip: echipament.tip || "laptop",
        angajatId: echipament.angajatId || "none",
      });
    }
  }, [echipament]);

  useEffect(() => {
    getAngajati()
      .then((res) => {
        if (Array.isArray(res.data)) {
          setAngajati(res.data);
        } else {
          console.error("❌ Răspuns invalid la getAngajati:", res);
          setAngajati([]);
        }
      })
      .catch((err) => {
        console.error("❌ Eroare la getAngajati:", err);
        setAngajati([]);
      });
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nume.trim()) newErrors.nume = "Numele este obligatoriu.";
    if (!formData.serie.trim()) newErrors.serie = "Seria este obligatorie.";
    if (!["laptop", "telefon", "sim"].includes(formData.tip)) newErrors.tip = "Tip invalid.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      nume: formData.nume.trim(),
      tip: formData.tip.trim(),
      serie: formData.serie.trim(),
      angajatId: formData.angajatId === "none" ? null : formData.angajatId,
    };

    try {
      const updated = await updateEchipament(echipament.id, payload);
      toast({
        title: "Echipament salvat",
        description: "Modificările au fost salvate cu succes.",
      });
      triggerRefresh(); 
      onUpdated(updated);
      onClose();
    } catch (error) {
      toast({
        title: "Eroare la salvare",
        description: "Actualizarea echipamentului a eșuat.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează echipamentul</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nume echipament</Label>
            <Input
              value={formData.nume}
              onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
            />
            {errors.nume && <p className="text-sm text-red-500">{errors.nume}</p>}
          </div>
          <div>
            <Label>Seria</Label>
            <Input
              value={formData.serie}
              onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
            />
            {errors.serie && <p className="text-sm text-red-500">{errors.serie}</p>}
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
            {errors.tip && <p className="text-sm text-red-500">{errors.tip}</p>}
          </div>
          <div>
            <Label>Angajat</Label>
            <Select
              value={formData.angajatId}
              onValueChange={(value) => setFormData({ ...formData, angajatId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Atribuie angajat (opțional)" />
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
