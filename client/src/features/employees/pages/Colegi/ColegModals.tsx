import React, { Suspense } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ModalAsigneazaEchipament from "./ModalAsigneazaEchipament";
import ModalEditColeg from "./ModalEditColeg";
import { useUpdateEchipament } from "@/features/equipment";
import { queueProcesVerbal } from "@/features/proceseVerbale/pvQueue";
import { getConfig } from "@/services/configService";
import type { Angajat } from "@/features/equipment/types";

const ModalAddColeg = React.lazy(() => import("@/pages/Dashboard/modals/ModalAddColeg"));

interface ReplaceData {
  colegId: string;
  equipmentId: string;
  type: string;
}

interface ColegModalsProps {
  selectedAngajatId: string | null;
  setSelectedAngajatId: (id: string | null) => void;
  replaceData: ReplaceData | null;
  setReplaceData: (d: ReplaceData | null) => void;
  editColeg: Angajat | null;
  setEditColeg: (c: Angajat | null) => void;
  confirmDelete: Angajat | null;
  setConfirmDelete: (c: Angajat | null) => void;
  showAddModal: boolean;
  setShowAddModal: (v: boolean) => void;
  search: string;
  refetch: () => void;
  setExpanded: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleDelete: (id: string) => void;
  onPVChange: (colegId: string, change: { predate?: string[]; primite?: string[] }) => void;
}

export default function ColegModals({
  selectedAngajatId,
  setSelectedAngajatId,
  replaceData,
  setReplaceData,
  editColeg,
  setEditColeg,
  confirmDelete,
  setConfirmDelete,
  showAddModal,
  setShowAddModal,
  search,
  refetch,
  setExpanded,
  handleDelete,
  onPVChange,
}: ColegModalsProps) {
  const updateMutation = useUpdateEchipament();

  return (
    <>
      {selectedAngajatId && (
        <ModalAsigneazaEchipament
          angajatId={selectedAngajatId}
          onClose={() => setSelectedAngajatId(null)}
          onPendingPV={(change) => onPVChange(selectedAngajatId, change)}
          onSuccess={() => {
            refetch();
            setExpanded(new Set());
            setSelectedAngajatId(null);
          }}
        />
      )}
      {replaceData && (
        <ModalAsigneazaEchipament
          angajatId={replaceData.colegId}
          filterTip={replaceData.type}
          oldEchipamentId={replaceData.equipmentId}
          onReplace={async (oldId, newId) => {
            await updateMutation.mutateAsync({
              id: oldId,
              data: { angajatId: null, stare: "disponibil" },
            });
            await updateMutation.mutateAsync({
              id: newId,
              data: { angajatId: replaceData.colegId, stare: "predat" },
            });
            const { pvGenerationMode } = await getConfig();
              if (pvGenerationMode === "auto") {
                const url = await genereazaProcesVerbal(replaceData.colegId, "SCHIMB", {
                  predate: [oldId],
                  primite: [newId],
                });
                window.open(url, "_blank");
              } else {
                queueProcesVerbal(replaceData.colegId, "SCHIMB", {
                  predate: [oldId],
                  primite: [newId],
                });
              }
          }}
          onPendingPV={(change) => onPVChange(replaceData.colegId, change)}
          onClose={() => setReplaceData(null)}
          onSuccess={() => {
            refetch();
            setExpanded(new Set());
            setReplaceData(null);
          }}
        />
      )}
      {editColeg && (
        <ModalEditColeg
          coleg={editColeg}
          onClose={() => setEditColeg(null)}
          onSuccess={() => {
            refetch();
            setExpanded(new Set());
          }}
        />
      )}
      {confirmDelete && (
        <Dialog open onOpenChange={() => setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmare ștergere</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Ștergerea acestui coleg va elibera echipamentele asignate. Continuă?
            </p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Anulează
              </Button>
              <Button
                onClick={() => {
                  handleDelete(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Confirmă
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Suspense fallback={null}>
        {showAddModal && (
          <ModalAddColeg onClose={() => setShowAddModal(false)} defaultName={search.trim()} />
        )}
      </Suspense>
    </>
  );
}