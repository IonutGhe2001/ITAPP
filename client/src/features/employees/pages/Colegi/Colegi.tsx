import { useState } from "react";
import {
  useAngajati,
  useDeleteAngajat,
} from "@/features/employees";
import type { Angajat, Echipament } from "@/features/equipment/types";
import { useUpdateEchipament } from "@/features/equipment";
import { getEquipmentIcon } from "@/utils/equipmentIcons";
import ModalAsigneazaEchipament from "./ModalAsigneazaEchipament";
import ModalEditColeg from "./ModalEditColeg";
import Container from "@/components/Container";
import Avatar from "@/components/Avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

export default function Colegi() {
  const { data: colegi = [], refetch } = useAngajati();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedAngajatId, setSelectedAngajatId] = useState<string | null>(null);
  const [replaceData, setReplaceData] = useState<
    { colegId: string; equipmentId: string; type: string } | null
  >(null);
  const [editColeg, setEditColeg] = useState<Angajat | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Angajat | null>(null);
  const deleteMutation = useDeleteAngajat();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();

  const toggleExpand = (id: string) => {
     setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Coleg șters" });
      refetch();
      setExpanded(new Set());
    } catch {
      toast({ title: "Eroare", description: "Nu s-a putut șterge colegul", variant: "destructive" });
    }
  };

  const handleRemoveEquipment = async (id: string) => {
    try {
      await updateMutation.mutateAsync({
        id,
        data: { angajatId: null, stare: "disponibil" },
      });
      toast({ title: "Echipament eliberat" });
      refetch();
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza echipamentul",
        variant: "destructive",
      });
    }
  };

  const filtered = colegi;

  return (
    <Container className="py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
         {filtered.map((coleg: Angajat & { echipamente: Echipament[] }) => (
          <div
            key={coleg.id}
            className="relative bg-card rounded-xl shadow-md p-4 flex flex-col gap-4"
          >
            <div className="absolute top-2 left-2 flex gap-2">
              <button
                onClick={() => setEditColeg(coleg)}
                className="p-1 rounded hover:bg-muted"
                title="Editează"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  coleg.echipamente.length > 0
                    ? setConfirmDelete(coleg)
                    : handleDelete(coleg.id)
                }
                className="p-1 rounded hover:bg-muted"
                title="Șterge"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
            <div className="flex items-center gap-4">
             <Avatar
                name={coleg.numeComplet}
                className="w-16 h-16"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{coleg.numeComplet}</p>
                <p className="text-sm text-muted-foreground">{coleg.functie}</p>
                <p className="text-sm text-muted-foreground">{coleg.email}</p>
                <p className="text-sm text-muted-foreground">{coleg.telefon}</p>
              </div>
            </div>
            
            {expanded.has(coleg.id) && (
              <ul className="space-y-2 mt-2">
                {coleg.echipamente.length === 0 ? (
                  <li className="text-muted-foreground italic">
                    Nu are echipamente alocate.
                  </li>
                ) : (
                  coleg.echipamente.map((e: Echipament) => (
                    <li
                      key={e.id}
                       className="flex items-start gap-3 text-sm border border-border rounded-lg p-2 shadow-sm bg-muted"
                    >
                     <div className="pt-0.5">{getEquipmentIcon(e.tip)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{e.nume}</p>
                        <p className="text-xs text-muted-foreground">Serie: {e.serie}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full self-center capitalize">
                          {e.tip}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleRemoveEquipment(e.id)}
                            className="text-[10px] text-red-600 hover:underline"
                          >
                            Elimină
                          </button>
                          <button
                            onClick={() =>
                              setReplaceData({ colegId: coleg.id, equipmentId: e.id, type: e.tip })
                            }
                            className="text-[10px] text-primary hover:underline"
                          >
                            Schimbă
                          </button>
                        </div>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
            <div className="flex justify-between items-center gap-4 text-sm mt-auto">
              <button
                onClick={() => toggleExpand(coleg.id)}
                className="text-sm text-primary hover:underline self-start"
              >
                {expanded.has(coleg.id) ? "Ascunde echipamente" : "Vezi echipamente"}
              </button>
              <button
                onClick={() => setSelectedAngajatId(coleg.id)}
                className="text-sm text-primary hover:underline"
              >
                Asignează echipament
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAngajatId && (
      <ModalAsigneazaEchipament
            angajatId={selectedAngajatId}
            onClose={() => setSelectedAngajatId(null)}
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
            toast({ title: "Echipament schimbat" });
          }}
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
    </Container>
  );
}
