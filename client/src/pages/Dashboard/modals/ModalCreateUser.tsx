"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

interface ModalCreateUserProps {
  onClose: () => void;
}

export default function ModalCreateUser({ onClose }: ModalCreateUserProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nume: "",
    prenume: "",
    functie: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { email, password, nume, prenume, functie, role } = formData;

    if (!email || !password || !nume || !prenume || !functie || !role) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      toast({
        title: "Cont creat",
        description: "Utilizatorul a fost înregistrat cu succes.",
      });
      onClose();
    } catch (err: unknown) {
      console.error("Eroare la creare cont:", err);
      const e = err as { response?: { data?: { error?: string } } };
      toast({
        title: "Eroare",
        description: e.response?.data?.error || "Nu s-a putut crea contul.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creează cont nou</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Parolă</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Nume</Label>
            <Input name="nume" value={formData.nume} onChange={handleChange} />
          </div>
          <div>
            <Label>Prenume</Label>
            <Input name="prenume" value={formData.prenume} onChange={handleChange} />
          </div>
          <div>
            <Label>Funcție</Label>
            <Input name="functie" value={formData.functie} onChange={handleChange} />
          </div>
          <div>
            <Label>Rol</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selectează rolul" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Se creează..." : "Creează cont"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
