import { useState, memo, useMemo } from "react";
import { FaLaptop, FaMobileAlt, FaSimCard } from "react-icons/fa";
import { PencilIcon, TrashIcon } from "lucide-react";
import ModalPredaEchipament from "@/features/echipamente/components/ModalPredaEchipament";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { EquipmentCardProps } from "@/features/echipamente/types";

function getIcon(tip: string) {
  const baseStyle = "text-2xl text-primary";
  switch (tip) {
    case "telefon":
      return <FaMobileAlt className={baseStyle} />;
    case "sim":
      return <FaSimCard className={baseStyle} />;
    case "laptop":
    default:
      return <FaLaptop className={baseStyle} />;
  }
}

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

  const icon = useMemo(() => getIcon(echipament.tip), [echipament.tip]);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="text-sm space-y-1">
          <p className="font-semibold text-gray-900">{echipament.nume}</p>
          <p className="text-xs text-gray-600">Serie: {echipament.serie}</p>
          <p className="text-xs text-gray-600">Tip: {echipament.tip}</p>
          {echipament.angajat && (
            <p className="text-xs text-gray-600">
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
            <p className="text-sm text-gray-700">
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
