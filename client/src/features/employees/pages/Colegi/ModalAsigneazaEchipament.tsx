
import { useState } from "react";
import { useEchipamente, useUpdateEchipament } from "@/features/equipment";
import type { Echipament } from "@/features/equipment/types";
import { useToast } from "@/hooks/use-toast/use-toast-hook";
import { getApiErrorMessage } from "@/utils/apiError";

export default function ModalAsigneazaEchipament({
  angajatId,
  onClose,
  onSuccess,
}: {
  angajatId: string;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { data: echipamente = [] } = useEchipamente();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState("");

  const handleAssign = async () => {
    if (!selectedId) return;

     try {
      await updateMutation.mutateAsync({
        id: selectedId,
        data: { angajatId, stare: "predat" },
      });

    onClose();
      onSuccess?.();
    } catch (err) {
      toast({
        title: "Eroare la asignare",
        description: getApiErrorMessage(err),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-2xl shadow-xl p-6 w-full max-w-md relative space-y-4">
        <h2 className="text-lg font-semibold text-primary">Asignează echipament</h2>

        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
        >
          <option value="">Selectează echipament disponibil</option>
           {echipamente
            .filter((e: Echipament) => e.stare === "disponibil")
            .map((e: Echipament) => (
            <option key={e.id} value={e.id}>
              {e.nume} – Serie: {e.serie}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/90"
          >
            Anulează
          </button>
          <button
            onClick={handleAssign}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark"
            disabled={!selectedId}
          >
            Asignează
          </button>
        </div>
      </div>
    </div>
  );
}
