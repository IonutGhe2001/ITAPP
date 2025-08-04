import { useState, memo, useMemo } from 'react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { EquipmentIcon } from '@/features/equipment';
import { ModalPredaEchipament } from '@/features/equipment';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { EquipmentCardProps } from '@/features/equipment/types';

function EquipmentCard({ echipament, onEdit, onDelete, onRefresh }: EquipmentCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [confirmRecupereaza, setConfirmRecupereaza] = useState(false);

  const handleConfirmRecupereaza = () => {
    onEdit?.({ ...echipament, angajatId: null, stare: 'in_stoc' });
    setConfirmRecupereaza(false);
    onRefresh?.();
  };

  const icon = useMemo(
    () => <EquipmentIcon type={echipament.tip} className="text-2xl text-primary" />,
    [echipament.tip]
  );

  return (
    <div className="bg-card flex items-center justify-between rounded-2xl p-5 shadow-md transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="space-y-1 text-sm">
          <p className="text-foreground font-semibold">{echipament.nume}</p>
          <p className="text-muted-foreground text-xs">Serie: {echipament.serie}</p>
          <p className="text-muted-foreground text-xs">Tip: {echipament.tip}</p>
          {echipament.angajat && (
            <p className="text-muted-foreground text-xs">
              Predat la: {echipament.angajat.numeComplet}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
            echipament.stare === 'in_stoc'
              ? 'bg-green-100 text-green-800'
              : echipament.stare === 'mentenanta'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
          }`}
        >
          {echipament.stare.replace('_', ' ')}
        </span>

        {echipament.stare === 'in_stoc' ? (
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-blue-600 hover:underline"
            title="Alocă echipamentul"
          >
            Alocă
          </button>
        ) : (
          <button
            onClick={() => setConfirmRecupereaza(true)}
            className="text-xs text-red-600 hover:underline"
            title="Recuperează echipamentul"
          >
            Recuperează
          </button>
        )}

        {echipament.stare === 'mentenanta' ? (
          <button
            onClick={() => onEdit?.({ ...echipament, stare: 'in_stoc' })}
            className="text-xs text-blue-600 hover:underline"
            title="Marchează în stoc"
          >
            În stoc
          </button>
        ) : (
          <button
            onClick={() => onEdit?.({ ...echipament, stare: 'mentenanta' })}
            className="text-xs text-yellow-600 hover:underline"
            title="Trimite în mentenanță"
          >
            Mentenanță
          </button>
        )}

        <div className="flex gap-2">
          <button onClick={() => onEdit?.({ ...echipament, __editMode: true })} title="Editează">
            <PencilIcon className="text-primary hover:text-primary-dark h-4 w-4" />
          </button>
          <button onClick={() => onDelete?.(echipament.id)}>
            <TrashIcon className="text-primary hover:text-primary-dark h-4 w-4" />
          </button>
        </div>
      </div>

      {showModal && (
        <ModalPredaEchipament
          echipament={echipament}
          onClose={() => setShowModal(false)}
          onSubmit={(data) => {
            onEdit?.(data);
            setShowModal(false);
            onRefresh?.();
          }}
        />
      )}

      {confirmRecupereaza && (
        <Dialog open onOpenChange={setConfirmRecupereaza}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare recuperare</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Sigur dorești să recuperezi acest echipament? Acesta va reveni în stoc și va fi
              disasociat de angajat.
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
      )}
    </div>
  );
}

export default memo(EquipmentCard);
