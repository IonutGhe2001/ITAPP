"use client";

import React, { Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Angajat } from "@/features/equipment/types";
const ModalAddColeg = React.lazy(() => import("./ModalAddColeg"));
import { useCreateEchipament, useEchipamente } from "@/features/equipment";
import { useAngajati } from "@/features/employees";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import { useEchipamentForm } from "./useEchipamentForm";
import EchipamentForm from "@/features/equipment/components/EchipamentForm";


export default function ModalAddEchipament({ onClose }: { onClose: () => void }) {
  const {
    formData,
    setFormData,
    errors,
    search,
    setSearch,
    showColegModal,
    setShowColegModal,
    validate,
    buildPayload,
  } = useEchipamentForm();

  const { data: angajati = [] } = useAngajati();
  const { data: echipamente = [] } = useEchipamente();
  const createMutation = useCreateEchipament();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!validate({
      nume: "Numele echipamentului este obligatoriu.",
      serie: "Seria este obligatorie.",
      tip: "Tipul este obligatoriu.",
    }))
      return;

    const payload = buildPayload();

    const duplicate = echipamente.find(
      (e) => e.tip === payload.tip && e.serie === payload.serie
    );
    if (duplicate) {
      toast({
        title: "Avertizare",
        description: "Un echipament cu aceeasi serie exista deja.",
        variant: "destructive",
      });
      return;
    }

    if (payload.angajatId) {
      const eqSameType = echipamente.find(
        (e) => e.angajatId === payload.angajatId && e.tip === payload.tip
      );
      if (eqSameType) {
        toast({
          title: "Avertizare",
          description: "Angajatul are deja un echipament de acest tip.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      await createMutation.mutateAsync(payload);
      toast({
        title: "Echipament adăugat",
        description: "Echipamentul a fost salvat cu succes.",
      });
      onClose();
    } catch {
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
          <EchipamentForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            search={search}
            setSearch={setSearch}
            angajati={angajati as Angajat[]}
            onAddColeg={() => setShowColegModal(true)}
          />

          <Button onClick={handleSubmit}>Salvează</Button>
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
