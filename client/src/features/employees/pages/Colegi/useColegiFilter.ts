import { useEffect, useMemo, useState } from 'react';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';

export type EmployeeLifecycleStatus = 'active' | 'pending' | 'inactive';
export type EmployeeStatusFilter = EmployeeLifecycleStatus | 'all';
export type EmployeeSortOption = 'name-asc' | 'name-desc' | 'created-desc';

interface UseColegiFilterOptions {
  initialSearch?: string;
  initialFunctions?: string[];
  initialStatus?: EmployeeStatusFilter;
  initialSort?: EmployeeSortOption;
}

const localeCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

const getDepartmentName = (coleg: AngajatWithRelations): string => {
  if ('department' in coleg) {
    const department = (coleg as unknown as { department?: unknown }).department;
    if (typeof department === 'string') return department;
    if (department && typeof department === 'object' && 'name' in department) {
      const name = (department as { name?: unknown }).name;
      if (typeof name === 'string') return name;
    }
  }
  if (
    'departmentName' in coleg &&
    typeof (coleg as { departmentName?: unknown }).departmentName === 'string'
  ) {
    return (coleg as { departmentName: string }).departmentName;
  }
  return '';
};

const getCreatedTimestamp = (coleg: AngajatWithRelations): number => {
  if ('createdAt' in coleg && typeof (coleg as { createdAt?: unknown }).createdAt === 'string') {
    return Date.parse((coleg as { createdAt: string }).createdAt);
  }
  if (coleg.dataAngajare) {
    return Date.parse(coleg.dataAngajare);
  }
  if ('created_at' in coleg && typeof (coleg as { created_at?: unknown }).created_at === 'string') {
    return Date.parse((coleg as { created_at: string }).created_at);
  }
  return 0;
};

export const getEmployeeLifecycleStatus = (
  coleg: AngajatWithRelations
): EmployeeLifecycleStatus => {
  if ('status' in coleg) {
    const status = (coleg as unknown as { status?: string }).status?.toLowerCase();
    if (status === 'active' || status === 'pending' || status === 'inactive') {
      return status;
    }
  }

  if (coleg.emailAccountStatus === 'PENDING') return 'pending';
  if (coleg.emailAccountStatus === 'CREATED') return 'active';
  if (coleg.cDataCreated) return 'active';

  return 'inactive';
};

export default function useColegiFilter(
  colegi: AngajatWithRelations[],
  {
    initialSearch = '',
    initialFunctions = [],
    initialStatus = 'all',
    initialSort = 'name-asc',
  }: UseColegiFilterOptions = {}
) {
  const [search, setSearch] = useState(initialSearch);
  const [functieFilter, setFunctieFilter] = useState<string[]>(initialFunctions);
  const [statusFilter, setStatusFilter] = useState<EmployeeStatusFilter>(initialStatus);
  const [sortOrder, setSortOrder] = useState<EmployeeSortOption>(initialSort);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setFunctieFilter(initialFunctions);
  }, [initialFunctions]);

  useEffect(() => {
    setStatusFilter(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    setSortOrder(initialSort);
  }, [initialSort]);

  const functii = useMemo(
    () =>
      Array.from(
        new Set(
          colegi
            .map((c) => c.functie || '')
            .filter((functie): functie is string => Boolean(functie?.trim()))
        )
      ).sort(localeCompare),
    [colegi]
  );

  const filtered = useMemo(() => {
    const normalizedFunctions = new Set(functieFilter.filter(Boolean));
    const normalizedQuery = search.trim().toLowerCase();

    const result = colegi.filter((coleg) => {
      if (normalizedFunctions.size > 0 && !normalizedFunctions.has(coleg.functie || '')) {
        return false;
      }

      if (statusFilter !== 'all' && getEmployeeLifecycleStatus(coleg) !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) return true;

      const department = getDepartmentName(coleg);
      return [coleg.numeComplet, coleg.functie, department, coleg.email, coleg.telefon]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalizedQuery));
    });

    return result.sort((a, b) => {
      const aName = a.numeComplet || '';
      const bName = b.numeComplet || '';

      switch (sortOrder) {
        case 'name-desc':
          return localeCompare(bName, aName);
        case 'created-desc':
          return getCreatedTimestamp(b) - getCreatedTimestamp(a);
        case 'name-asc':
        default:
          return localeCompare(aName, bName);
      }
    });
  }, [colegi, functieFilter, statusFilter, search, sortOrder]);

  return {
    search,
    setSearch,
    functieFilter,
    setFunctieFilter,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    functii,
    filtered,
  };
}
