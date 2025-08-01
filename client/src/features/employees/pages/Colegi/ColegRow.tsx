import React, { useLayoutEffect, useRef } from "react";
import Avatar from "@/components/Avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { getEquipmentIcon } from "@/utils/equipmentIcons";
import type { Angajat, Echipament } from "@/features/equipment/types";

interface ReplaceData {
  colegId: string;
  equipmentId: string;
  type: string;
}

interface ColegRowProps {
  coleg: Angajat & { echipamente: Echipament[] };
  index: number;
  style: React.CSSProperties;
  expanded: boolean;
  toggleExpand: (id: string, index: number) => void;
  handleRemoveEquipment: (eqId: string, colegId: string) => void;
  setEditColeg: (c: Angajat) => void;
  setConfirmDelete: (c: Angajat) => void;
  handleDelete: (id: string) => void;
  setSelectedAngajatId: (id: string) => void;
  setReplaceData: (data: ReplaceData) => void;
  setSize: (index: number, size: number) => void;
  pendingPV?: { predate: string[]; primite: string[] };
  onGeneratePV: (colegId: string) => void;
}

export default function ColegRow({
  coleg,
  index,
  style,
  expanded,
  toggleExpand,
  handleRemoveEquipment,
  setEditColeg,
  setConfirmDelete,
  handleDelete,
  setSelectedAngajatId,
  setReplaceData,
  setSize,
  pendingPV,
  onGeneratePV,
}: ColegRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height + 16);
    }
  }, [index, coleg, setSize]);

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
            {pendingPV && (pendingPV.predate.length > 0 || pendingPV.primite.length > 0) && (
              <p className="text-xs text-amber-600">Proces verbal în așteptare</p>
            )}
          </div>
        </div>
        {expanded && (
          <ul className="space-y-2 mt-2">
            {coleg.echipamente.length === 0 ? (
              <li className="text-muted-foreground italic">Nu are echipamente alocate.</li>
            ) : (
              coleg.echipamente.map((e) => (
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
                        onClick={() => handleRemoveEquipment(e.id, coleg.id)}
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
            {expanded ? "Ascunde echipamente" : "Vezi echipamente"}
          </button>
          <div className="flex gap-4">
            {pendingPV && (pendingPV.predate.length > 0 || pendingPV.primite.length > 0) && (
              <button
                onClick={() => onGeneratePV(coleg.id)}
                className="text-sm text-primary hover:underline"
              >
                Generează PV
              </button>
            )}
            <button
              onClick={() => setSelectedAngajatId(coleg.id)}
              className="text-sm text-primary hover:underline"
            >
              Asignează echipament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}