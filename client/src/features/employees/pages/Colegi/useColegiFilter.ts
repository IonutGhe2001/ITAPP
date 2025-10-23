import { useMemo, useState } from 'react';
import type { Angajat } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';

export default function useColegiFilter(
  colegi: AngajatWithRelations[],
) {
  const [search, setSearch] = useState('');
  const [functieFilter, setFunctieFilter] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const functii = useMemo(
    () =>
      Array.from(new Set(colegi.map((c) => c.functie || '')))
        .filter(Boolean)
        .sort(),
    [colegi],
  );

  const filtered = useMemo(() => {
    return colegi
      .filter((c) => {
        if (functieFilter && c.functie !== functieFilter) return false;
        const q = search.trim().toLowerCase();
        if (q) {
          const nume = (c.numeComplet || '').toLowerCase();
          const functie = (c.functie || '').toLowerCase();
          return nume.includes(q) || functie.includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        const aName = a.numeComplet || '';
        const bName = b.numeComplet || '';
        return sortOrder === 'asc'
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      });
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
