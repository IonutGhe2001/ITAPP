import { useState, memo, useMemo } from "react";
import { PencilIcon, TrashIcon } from "lucide-react";
import { getEquipmentIcon } from "@/utils/equipmentIcons";
import { ModalPredaEchipament } from "@/features/equipment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { EquipmentCardProps } from "@/features/equipment/types";

function EquipmentCard({
  echipament,
  onEdit,
  onDelete,
  onRefresh,
}: EquipmentCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [confirmRecupereaza, setConfirmRecupereaza] = useState(false);

  const handleConfirmRecupereaza = () => {
    onEdit?.({ ...echipament, angajatId: null, stare: "disponibil" });
    setConfirmRecupereaza(false);
    onRefresh?.();
  };

   const icon = useMemo(
    () => getEquipmentIcon(echipament.tip, "text-2xl text-primary"),
    [echipament.tip]
  );

  return (
    <div className="bg-card rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="text-sm space-y-1">
          <p className="font-semibold text-foreground">{echipament.nume}</p>
          <p className="text-xs text-muted-foreground">Serie: {echipament.serie}</p>
          <p className="text-xs text-muted-foreground">Tip: {echipament.tip}</p>
          {echipament.angajat && (
            <p className="text-xs text-muted-foreground">
              Predat la: {echipament.angajat.numeComplet}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            echipament.stare === "disponibil"
              ? "bg-green-100 text-green-800"
              : echipament.stare === "mentenanta"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {echipament.stare}
        </span>

        {echipament.stare === "disponibil" ? (
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-blue-600 hover:underline"
            title="Predă echipamentul"
          >
            Predă
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

{echipament.stare === "mentenanta" ? (
          <button
            onClick={() => onEdit?.({ ...echipament, stare: "disponibil" })}
            className="text-xs text-blue-600 hover:underline"
            title="Finalizează mentenanța"
          >
            Disponibil
          </button>
        ) : (
          <button
            onClick={() => onEdit?.({ ...echipament, stare: "mentenanta" })}
            className="text-xs text-yellow-600 hover:underline"
            title="Trimite în mentenanță"
          >
            Mentenanță
          </button>
        )}
        
        <div className="flex gap-2">
          <button onClick={() => onEdit?.({ ...echipament, __editMode: true })} title="Editează">
  <PencilIcon className="w-4 h-4 text-primary hover:text-primary-dark" />
</button>
           <button onClick={() => onDelete?.(echipament.id)}>
            <TrashIcon className="w-4 h-4 text-primary hover:text-primary-dark" />
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
            <p className="text-sm text-muted-foreground">
              Sigur dorești să recuperezi acest echipament? Acesta va deveni disponibil și va fi disasociat de angajat.
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
