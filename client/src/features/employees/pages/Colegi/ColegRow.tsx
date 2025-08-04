import React, { useLayoutEffect, useRef } from 'react';
import Avatar from '@/components/Avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { getEquipmentIcon } from '@/utils/equipmentIcons';
import type { Angajat, Echipament } from '@/features/equipment/types';
import { useUpdateAngajat } from '@/features/employees';

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
  setCreateEmail: (c: Angajat) => void;
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
  setCreateEmail,
}: ColegRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const updateAngajat = useUpdateAngajat();

  useLayoutEffect(() => {
    if (rowRef.current) {
      setSize(index, rowRef.current.getBoundingClientRect().height + 16);
    }
  }, [index, coleg, setSize]);

  return (
    <div style={style} className="py-2">
      <div ref={rowRef} className="bg-card relative flex flex-col gap-4 rounded-xl p-4 shadow-md">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted absolute right-2 top-2 rounded p-1">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditColeg(coleg)}>
              <Pencil className="h-4 w-4" />
              <span>Editează</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                coleg.echipamente.length > 0 ? setConfirmDelete(coleg) : handleDelete(coleg.id)
              }
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span>Șterge</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-4">
          <Avatar name={coleg.numeComplet} className="h-16 w-16" />
          <div className="flex-1">
            <p className="text-foreground font-semibold">{coleg.numeComplet}</p>
            <p className="text-muted-foreground text-sm">{coleg.functie}</p>
            <p className="text-muted-foreground text-sm">
              {coleg.email}
              {coleg.emailAccountStatus === 'PENDING' && ' (pendinte)'}
            </p>
            {coleg.emailAccountStatus === 'CREATED' && coleg.emailAccountLink && (
              <a
                href={coleg.emailAccountLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs underline"
              >
                Deschide e-mail
              </a>
            )}
            <p className="text-muted-foreground text-sm">{coleg.telefon}</p>
            {coleg.cDataUsername && (
              <p className="text-muted-foreground text-sm">c-data user: {coleg.cDataUsername}</p>
            )}
            {coleg.cDataId && (
              <p className="text-muted-foreground text-sm">c-data ID: {coleg.cDataId}</p>
            )}
            {coleg.cDataNotes && (
              <p className="text-muted-foreground break-all text-sm">{coleg.cDataNotes}</p>
            )}
            <p className="text-muted-foreground text-sm">
              Cont c-data: {coleg.cDataCreated ? 'Creat' : 'Necreat'}
              {!coleg.cDataCreated && (
                <button
                  onClick={() =>
                    updateAngajat.mutate({
                      id: coleg.id,
                      data: { cDataCreated: true },
                    })
                  }
                  className="text-primary ml-2 text-xs hover:underline"
                >
                  Marchează creat
                </button>
              )}
            </p>
            {pendingPV && (pendingPV.predate.length > 0 || pendingPV.primite.length > 0) && (
              <Badge variant="destructive" className="mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Proces verbal în așteptare
              </Badge>
            )}
          </div>
        </div>
        {expanded && (
          <ul className="mt-2 space-y-2">
            {coleg.echipamente.length === 0 ? (
              <li className="text-muted-foreground italic">Nu are echipamente alocate.</li>
            ) : (
              coleg.echipamente.map((e) => (
                <li
                  key={e.id}
                  className="border-border bg-muted flex items-start gap-3 rounded-lg border p-2 text-sm shadow-sm"
                >
                  <div className="pt-0.5">{getEquipmentIcon(e.tip)}</div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{e.nume}</p>
                    <p className="text-muted-foreground text-xs">Serie: {e.serie}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-primary/10 text-primary self-center rounded-full px-2 py-0.5 text-xs capitalize">
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
                        className="text-primary text-[10px] hover:underline"
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
        <div className="mt-auto flex items-center justify-between gap-4 text-sm">
          <button
            onClick={() => toggleExpand(coleg.id, index)}
            className="text-primary self-start text-sm hover:underline"
          >
            {expanded ? 'Ascunde echipamente' : 'Vezi echipamente'}
          </button>
          <div className="flex gap-4">
            {pendingPV && (pendingPV.predate.length > 0 || pendingPV.primite.length > 0) && (
              <button
                onClick={() => onGeneratePV(coleg.id)}
                className="text-primary text-sm hover:underline"
              >
                Generează PV
              </button>
            )}
            {coleg.emailAccountStatus === 'PENDING' && (
              <button
                onClick={() => setCreateEmail(coleg)}
                className="text-primary text-sm hover:underline"
              >
                Marchează cont e-mail creat
              </button>
            )}
            <button
              onClick={() => setSelectedAngajatId(coleg.id)}
              className="text-primary text-sm hover:underline"
            >
              Asignează echipament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
