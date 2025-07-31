import React, { useState, useLayoutEffect, useRef, Suspense } from "react";
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
const ModalAddColeg = React.lazy(() =>
  import("@/pages/Dashboard/modals/ModalAddColeg")
);
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { VariableSizeList as List } from "react-window";
import { useToast } from "@/hooks/use-toast/use-toast-hook";

export default function Colegi() {
  const { data: colegi = [], refetch } = useAngajati() as {
    data: (Angajat & { echipamente: Echipament[] })[] | undefined;
    refetch: () => void;
  };
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedAngajatId, setSelectedAngajatId] = useState<string | null>(null);
  const [replaceData, setReplaceData] = useState<
    { colegId: string; equipmentId: string; type: string } | null
  >(null);
  const [editColeg, setEditColeg] = useState<Angajat | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Angajat | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const deleteMutation = useDeleteAngajat();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [functieFilter, setFunctieFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const functii: string[] = Array.from(
    new Set<string>(colegi.map((c: Angajat) => c.functie))
  ).sort();

  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const rowHeights = useRef<number[]>([]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      setWidth(node.offsetWidth);
      setHeight(node.offsetHeight);
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    requestAnimationFrame(updateSize);
    window.addEventListener("resize", updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const getSize = (index: number) => rowHeights.current[index] ?? 200;

  const setSize = (index: number, size: number) => {
    if (rowHeights.current[index] !== size) {
      rowHeights.current[index] = size;
      listRef.current?.resetAfterIndex(index);
    }
  };

  const toggleExpand = (id: string, index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    requestAnimationFrame(() => listRef.current?.resetAfterIndex(index));
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

  const filtered = colegi
    .filter((c: Angajat & { echipamente: Echipament[] }) => {
      if (functieFilter && c.functie !== functieFilter) return false;
      const q = search.trim().toLowerCase();
      if (q) {
        return (
          c.numeComplet.toLowerCase().includes(q) ||
          c.functie.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a: Angajat, b: Angajat) =>
      sortOrder === "asc"
        ? a.numeComplet.localeCompare(b.numeComplet)
        : b.numeComplet.localeCompare(a.numeComplet)
    );

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const coleg = filtered[index];
    const rowRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (rowRef.current) {
       setSize(index, rowRef.current.getBoundingClientRect().height + 16);
      }
    }, [index, coleg]);

    return (
      <div style={style} className="py-2">
        <div ref={rowRef} className="relative bg-card rounded-xl shadow-md p-4 flex flex-col gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-2 right-2 p-1 rounded hover:bg-muted">
                <MoreHorizontal className="w-4 h-4" />
              </button>
             </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditColeg(coleg)}>
                <Pencil className="w-4 h-4" />
                <span>Editează</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  coleg.echipamente.length > 0
                    ? setConfirmDelete(coleg)
                    : handleDelete(coleg.id)
                }
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span>Șterge</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex items-center gap-4">
            <Avatar name={coleg.numeComplet} className="w-16 h-16" />
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
              onClick={() => toggleExpand(coleg.id, index)}
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
      </div>
    );
  };

  return (
    <Container className="py-6 space-y-6">
      <div className="sticky top-0 z-10 space-y-4 pb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Caută după nume sau funcție"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
          />
          <select
            value={functieFilter}
            onChange={(e) => setFunctieFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
          >
            <option value="">Toate funcțiile</option>
            {functii.map((f: string) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
          >
            <option value="asc">Nume A-Z</option>
            <option value="desc">Nume Z-A</option>
          </select>
        </div>
      </div>

      <div ref={containerRef} className="h-[60vh] max-h-[600px]">
        {width > 0 && height > 0 && filtered.length > 0 && (
          <List
            ref={listRef}
            height={height}
            width={width}
            itemCount={filtered.length}
            itemSize={getSize}
            overscanCount={5}
          >
            {Row}
          </List>
        )}
        {width > 0 && height > 0 && filtered.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-sm text-muted-foreground">
              <p>
                {search.trim()
                  ? "Nu s-au găsit colegi."
                  : "Nu există colegi înregistrați."}
              </p>
              {search.trim() && (
                <Button className="mt-2" onClick={() => setShowAddModal(true)}>
                  Adaugă coleg nou
                </Button>
              )}
            </div>
          </div>
        )}
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
       <Suspense fallback={null}>
        {showAddModal && (
          <ModalAddColeg
            onClose={() => setShowAddModal(false)}
            defaultName={search.trim()}
          />
        )}
      </Suspense>
    </Container>
  );
}
