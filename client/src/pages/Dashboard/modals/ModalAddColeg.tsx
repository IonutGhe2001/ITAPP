"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateAngajat } from "@/features/employees";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

export default function ModalAddColeg({
  onClose,
  defaultName = "",
}: {
  onClose: () => void
  defaultName?: string
}) {
  const [formData, setFormData] = useState({
    numeComplet: defaultName,
    functie: "",
    email: "",
    telefon: "",
    cDataUsername: "",
    cDataId: "",
    cDataNotes: "",
    cDataCreated: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const createMutation = useCreateAngajat();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.numeComplet.trim().length < 2) newErrors.numeComplet = "Numele trebuie să aibă cel puțin 2 caractere.";
    if (formData.functie.trim().length < 2) newErrors.functie = "Funcția este obligatorie.";
    if (formData.email && !formData.email.includes("@")) newErrors.email = "Emailul nu este valid.";
    if (formData.telefon && formData.telefon.length < 10) newErrors.telefon = "Numărul de telefon trebuie să aibă cel puțin 10 caractere.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await createMutation.mutateAsync(formData);
      toast({ title: "Coleg adăugat", description: "Coleg adăugat cu succes." });
      onClose();
    } catch {
      toast({ title: "Eroare", description: "Eroare la adăugare coleg.", variant: "destructive" });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă coleg</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {(
            [
              "numeComplet",
              "functie",
              "email",
              "telefon",
              "cDataUsername",
              "cDataId",
              "cDataNotes",
            ] as const
          ).map((field) => (
            <div key={field}>
               <Label htmlFor={field}>
                {(
                  {
                    numeComplet: "Nume complet",
                    functie: "Funcție",
                    email: "Email",
                    telefon: "Telefon",
                    cDataUsername: "c-data username",
                    cDataId: "c-data ID",
                    cDataNotes: "Note/Link c-data",
                  } as Record<string, string>
                )[field]}
              </Label>
              <Input
                id={field}
               value={formData[field as keyof typeof formData] as any}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              />
              {errors[field] && (
                <p className="text-xs text-red-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              id="cDataCreated"
              type="checkbox"
              checked={formData.cDataCreated}
              onChange={(e) =>
                setFormData({ ...formData, cDataCreated: e.target.checked })
              }
            />
            <Label htmlFor="cDataCreated">Cont c-data creat</Label>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-primary text-white hover:bg-primary/90"
          >
            Salvează
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
