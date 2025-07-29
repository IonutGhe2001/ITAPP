import { useState } from "react";
import { useAngajati } from "@/features/employees";
import type { Angajat, Echipament } from "@/features/equipment/types";
import { getEquipmentIcon } from "@/utils/equipmentIcons";
import ModalAsigneazaEchipament from "./ModalAsigneazaEchipament";
import Container from "@/components/Container";

export default function Colegi() {
  const { data: colegi = [], refetch } = useAngajati();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedAngajatId, setSelectedAngajatId] = useState<string | null>(null);

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

  const filtered = colegi;

  return (
    <Container className="py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
         {filtered.map((coleg: Angajat & { echipamente: Echipament[] }) => (
          <div
            key={coleg.id}
            className="bg-card rounded-xl shadow-md p-4 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
             <img
   src="/profile.png"
    alt="avatar"
    loading="lazy"
    className="w-16 h-16 rounded-full"
  />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{coleg.numeComplet}</p>
                <p className="text-sm text-muted-foreground">{coleg.functie}</p>
                <p className="text-sm text-muted-foreground">{coleg.email}</p>
                <p className="text-sm text-muted-foreground">{coleg.telefon}</p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4 text-sm">
              <button
                onClick={() => toggleExpand(coleg.id)}
                className="text-sm text-primary hover:underline self-start"
              >
                {expanded.has(coleg.id) ? "Ascunde echipamente" : "Vezi echipamente"}
              </button>

              <button
                onClick={() => setSelectedAngajatId(coleg.id)}
                className="text-sm text-primary hover:underline self-start"
              >
                Asignează echipament
              </button>
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
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full self-center capitalize">
                        {e.tip}
                      </span>
                    </li>
                  ))
                )}
              </ul>
            )}
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
    </Container>
  );
}
