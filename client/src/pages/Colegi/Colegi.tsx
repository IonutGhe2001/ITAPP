import { useState, type JSX } from "react";
import { useAngajati } from "../../services/angajatiService";
import type { Angajat, Echipament } from "@/features/echipamente/types";
import {
  LaptopIcon,
  SmartphoneIcon,
  NetworkIcon,
} from "lucide-react";
import ModalAsigneazaEchipament from "./ModalAsigneazaEchipament";
import Container from "@/components/Container";

export default function Colegi() {
  const { data: colegi = [], refetch } = useAngajati();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedAngajatId, setSelectedAngajatId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded((prev: string | null) => (prev === id ? null : id));
  };

  const iconMap: Record<string, JSX.Element> = {
    laptop: <LaptopIcon className="w-4 h-4 text-primary" />,
    telefon: <SmartphoneIcon className="w-4 h-4 text-primary" />,
    sim: <NetworkIcon className="w-4 h-4 text-primary" />,
  };

  const filtered = colegi;

  return (
    <Container className="py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map((coleg: Angajat & { echipamente: Echipament[] }) => (
          <div
            key={coleg.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-4"
          >
            <div className="flex items-center gap-4">
             <img
   src="/profile.png"
    alt="avatar"
    loading="lazy"
    className="w-16 h-16 rounded-full"
  />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{coleg.numeComplet}</p>
                <p className="text-sm text-gray-600">{coleg.functie}</p>
                <p className="text-sm text-gray-600">{coleg.email}</p>
                <p className="text-sm text-gray-600">{coleg.telefon}</p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4 text-sm">
              <button
                onClick={() => toggleExpand(coleg.id)}
                className="text-sm text-primary hover:underline self-start"
              >
                {expanded === coleg.id ? "Ascunde echipamente" : "Vezi echipamente"}
              </button>

              <button
                onClick={() => setSelectedAngajatId(coleg.id)}
                className="text-sm text-primary hover:underline self-start"
              >
                Asignează echipament
              </button>
            </div>
            {expanded === coleg.id && (
              <ul className="space-y-2 mt-2">
                {coleg.echipamente.length === 0 ? (
                  <li className="text-gray-400 italic">
                    Nu are echipamente alocate.
                  </li>
                ) : (
                  coleg.echipamente.map((e: Echipament) => (
                    <li
                      key={e.id}
                      className="flex items-start gap-3 text-sm border border-gray-100 rounded-lg p-2 shadow-sm bg-gray-50"
                    >
                      <div className="pt-0.5">{iconMap[e.tip] || "🔧"}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{e.nume}</p>
                        <p className="text-xs text-gray-500">Serie: {e.serie}</p>
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
              setExpanded(null);
              setSelectedAngajatId(null);
            }}
          />
      )}
    </Container>
  );
}
