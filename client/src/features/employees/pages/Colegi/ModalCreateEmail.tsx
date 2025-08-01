import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCreateEmailAccount } from "@/features/employees";
import type { Angajat } from "@/features/equipment/types";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

interface ModalCreateEmailProps {
  coleg: Angajat;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalCreateEmail({ coleg, onClose, onSuccess }: ModalCreateEmailProps) {
  const [formData, setFormData] = useState({
    email: coleg.email || "",
    responsible: "",
    link: "",
  });
  const [errors, setErrors] = useState<{ responsible?: string }>({});
  const mutation = useCreateEmailAccount();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!formData.responsible) {
      errs.responsible = "Responsabilul este necesar.";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await mutation.mutateAsync({ id: coleg.id, ...formData });
      toast({ title: "Cont e-mail marcat ca creat" });
      onSuccess();
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut marca contul ca creat",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marchează cont e-mail creat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Adresă e-mail</Label>
            <Input name="email" value={formData.email} readOnly />
          </div>
          <div className="space-y-2">
            <Label>Responsabil</Label>
            <Input name="responsible" value={formData.responsible} onChange={handleChange} />
            {errors.responsible && <p className="text-sm text-red-600">{errors.responsible}</p>}
          </div>
          <div className="space-y-2">
            <Label>Link sistem e-mail (opțional)</Label>
            <Input name="link" value={formData.link} onChange={handleChange} />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Anulează
            </Button>
            <Button type="submit">Marchează</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}