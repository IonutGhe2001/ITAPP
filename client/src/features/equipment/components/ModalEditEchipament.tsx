import React, { memo, Suspense } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateEchipament } from "@/features/equipment";
import { useAngajati } from "@/features/employees";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import { useEchipamentForm } from "@/pages/Dashboard/modals/useEchipamentForm";
import EchipamentForm from "./EchipamentForm";
const ModalAddColeg = React.lazy(() => import("@/pages/Dashboard/modals/ModalAddColeg"));
import type { ModalEditEchipamentProps, Angajat, Echipament } from "@/features/equipment/types";

function ModalEditEchipament({ echipament, onClose, onUpdated }: ModalEditEchipamentProps) {
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
  } = useEchipamentForm({
    nume: echipament.nume,
    serie: echipament.serie,
    tip: echipament.tip,
    angajatId: echipament.angajatId || 'none',
    metadata: echipament.metadata || '',
  });

  const { data: angajati = [] } = useAngajati();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();
  

  const handleSubmit = async () => {
    if (!validate({
      nume: "Numele este obligatoriu.",
      serie: "Seria este obligatorie.",
      tip: "Tip invalid.",
    }))
      return;

   const payload = buildPayload();

    try {
      const updated = await updateMutation.mutateAsync({ id: echipament.id, data: payload });
      toast({
        title: "Echipament salvat",
        description: "Modificările au fost salvate cu succes.",
      });
      onUpdated(updated as Echipament);
      onClose();
    } catch {
      toast({
        title: "Eroare la salvare",
        description: "Actualizarea echipamentului a eșuat.",
        variant: "destructive",
      });
    }
  };

  return (
     <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editează echipamentul</DialogTitle>
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

export default memo(ModalEditEchipament);
