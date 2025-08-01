import React, { useState, useLayoutEffect, useRef } from "react";
import {
  useAngajati,
  useDeleteAngajat,
} from "@/features/employees";
import type { Angajat, Echipament } from "@/features/equipment/types";
import { useUpdateEchipament } from "@/features/equipment";
import { genereazaProcesVerbal, type ProcesVerbalTip } from "@/features/proceseVerbale";
import { queueProcesVerbal } from "@/features/proceseVerbale/pvQueue";
import { getConfig } from "@/services/configService";
import ColegRow from "./ColegRow";
import ColegModals from "./ColegModals";
import useColegiFilter from "./useColegiFilter";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
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
  const [pendingPV, setPendingPV] = useState<Record<string, { predate: string[]; primite: string[] }>>({});

  const addPendingPV = (colegId: string, change: { predate?: string[]; primite?: string[] }) => {
    setPendingPV((prev) => {
      const current = prev[colegId] || { predate: [], primite: [] };
      return {
        ...prev,
        [colegId]: {
          predate: [...current.predate, ...(change.predate || [])],
          primite: [...current.primite, ...(change.primite || [])],
        },
      };
    });
  };

  const handleGeneratePV = async (colegId: string) => {
    const data = pendingPV[colegId];
    if (!data) return;
    const tip: ProcesVerbalTip =
      data.predate.length > 0 && data.primite.length > 0
        ? "SCHIMB"
        : data.primite.length > 0
        ? "PREDARE_PRIMIRE"
        : "RESTITUIRE";
    try {
      const url = await genereazaProcesVerbal(colegId, tip, data);
      window.open(url, "_blank");
      toast({ title: "Proces verbal generat" });
      setPendingPV((prev) => {
        const updated = { ...prev };
        delete updated[colegId];
        return updated;
      });
    } catch {
      toast({ title: "Eroare la generarea procesului verbal", variant: "destructive" });
    }
  };

  const {
    search,
    setSearch,
    functieFilter,
    setFunctieFilter,
    sortOrder,
    setSortOrder,
    functii,
    filtered,
  } = useColegiFilter(colegi as (Angajat & { echipamente: Echipament[] })[]);

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

  const handleRemoveEquipment = async (eqId: string, colegId: string) => {
    try {
      await updateMutation.mutateAsync({
        id: eqId,
        data: { angajatId: null, stare: "disponibil" },
      });
      const { pvGenerationMode } = await getConfig();
        if (pvGenerationMode === "auto") {
          const url = await genereazaProcesVerbal(colegId, "RESTITUIRE", {
            predate: [eqId],
          });
          window.open(url, "_blank");
        } else {
          queueProcesVerbal(colegId, "RESTITUIRE", { predate: [eqId] });
        }
      addPendingPV(colegId, { predate: [eqId] });
      toast({ title: "Echipament eliberat", description: "Proces verbal în așteptare" });
      refetch();
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza echipamentul",
        variant: "destructive",
      });
    }
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
            {({ index, style }) => (
              <ColegRow
                coleg={filtered[index]}
                index={index}
                style={style}
                expanded={expanded.has(filtered[index].id)}
                toggleExpand={toggleExpand}
                handleRemoveEquipment={handleRemoveEquipment}
                setEditColeg={setEditColeg}
                setConfirmDelete={setConfirmDelete}
                handleDelete={handleDelete}
                setSelectedAngajatId={setSelectedAngajatId}
                setReplaceData={setReplaceData}
                setSize={setSize}
                pendingPV={pendingPV[filtered[index].id]}
                onGeneratePV={handleGeneratePV}
              />
            )}
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

      <ColegModals
        selectedAngajatId={selectedAngajatId}
        setSelectedAngajatId={setSelectedAngajatId}
        replaceData={replaceData}
        setReplaceData={setReplaceData}
        editColeg={editColeg}
        setEditColeg={setEditColeg}
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        search={search}
        refetch={refetch}
        setExpanded={setExpanded}
        handleDelete={handleDelete}
        onPVChange={addPendingPV}
      />
    </Container>
  );
}
