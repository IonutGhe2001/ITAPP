import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUpdateAngajat } from "@/features/employees";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import type { Angajat } from "@/features/equipment/types";

export default function ModalEditColeg({
  coleg,
  onClose,
  onSuccess,
}: {
  coleg: Angajat;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState({
    numeComplet: coleg.numeComplet,
    functie: coleg.functie,
    email: coleg.email || "",
    telefon: coleg.telefon || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const updateMutation = useUpdateAngajat();
  const { toast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.numeComplet.trim().length < 2)
      newErrors.numeComplet = "Numele trebuie să aibă cel puțin 2 caractere.";
    if (formData.functie.trim().length < 2)
      newErrors.functie = "Funcția este obligatorie.";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Emailul nu este valid.";
    if (formData.telefon && formData.telefon.length < 10)
      newErrors.telefon = "Numărul de telefon trebuie să aibă cel puțin 10 caractere.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await updateMutation.mutateAsync({ id: coleg.id, data: formData });
      toast({ title: "Coleg actualizat", description: "Modificările au fost salvate." });
      onSuccess?.();
      onClose();
    } catch {
      toast({
        title: "Eroare",
        description: "Eroare la actualizare coleg.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează coleg</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {["numeComplet", "functie", "email", "telefon"].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === "numeComplet" ? "Nume complet" : field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                id={field}
                value={formData[field as keyof typeof formData]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
              {errors[field] && (
                <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
          <Button onClick={handleSubmit} className="w-full bg-primary text-white hover:bg-primary/90">
            Salvează
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}