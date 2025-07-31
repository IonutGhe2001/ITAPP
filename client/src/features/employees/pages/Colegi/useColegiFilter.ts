import { useMemo, useState } from "react";
import type { Angajat, Echipament } from "@/features/equipment/types";

export default function useColegiFilter(
  colegi: (Angajat & { echipamente: Echipament[] })[]
) {
  const [search, setSearch] = useState("");
  const [functieFilter, setFunctieFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const functii = useMemo(
    () => Array.from(new Set(colegi.map((c) => c.functie))).sort(),
    [colegi]
  );

  const filtered = useMemo(() => {
    return colegi
      .filter((c) => {
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
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.numeComplet.localeCompare(b.numeComplet)
          : b.numeComplet.localeCompare(a.numeComplet)
      );
  }, [colegi, functieFilter, search, sortOrder]);

  return {
    search,
    setSearch,
    functieFilter,
    setFunctieFilter,
    sortOrder,
    setSortOrder,
    functii,
    filtered,
  };
}