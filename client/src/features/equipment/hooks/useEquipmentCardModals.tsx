import { useState } from 'react';
import { ModalPredaEchipament } from '@/features/equipment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type {
  EquipmentCardModalsProps,
  EquipmentCardModalsResult,
} from '@/features/equipment/types';

export default function useEquipmentCardModals({
  echipament,
  onEdit,
  onRefresh,
}: EquipmentCardModalsProps): EquipmentCardModalsResult {
  const [showModal, setShowModal] = useState(false);
  const [confirmRecupereaza, setConfirmRecupereaza] = useState(false);

  const handleConfirmRecupereaza = () => {
    onEdit?.({ ...echipament, angajatId: null, stare: 'in_stoc' });
    setConfirmRecupereaza(false);
    onRefresh?.();
  };

  const allocationModal = showModal ? (
    <ModalPredaEchipament
      echipament={echipament}
      onClose={() => setShowModal(false)}
      onSubmit={(data) => {
        onEdit?.(data);
        setShowModal(false);
        onRefresh?.();
      }}
    />
  ) : null;

  const recupereazaModal = confirmRecupereaza ? (
    <Dialog open onOpenChange={setConfirmRecupereaza}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmare recuperare</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          Sigur dorești să recuperezi acest echipament? Acesta va reveni în stoc și va fi disasociat
          de angajat.
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setConfirmRecupereaza(false)}>
            Anulează
          </Button>
          <Button variant="default" onClick={handleConfirmRecupereaza}>
            Confirmă
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;

  return {
    openAllocation: () => setShowModal(true),
    openRecupereaza: () => setConfirmRecupereaza(true),
    allocationModal,
    recupereazaModal,
  };
}
