import { useState, useLayoutEffect, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VariableSizeList as List } from 'react-window';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Toolbar from '@/components/Toolbar';
import Container from '@/components/Container';
import StatusBadge from '@/components/StatusBadge';
import { useAngajati, useDeleteAngajat } from '@/features/employees';
import type { Angajat } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';
import { genereazaProcesVerbal, type ProcesVerbalTip } from '@/features/proceseVerbale';
import { getQueue, removeFromQueue } from '@/features/proceseVerbale/pvQueue';
import ColegRow from './ColegRow';
import ColegModals from './ColegModals';
import useColegiFilter, {
  getEmployeeLifecycleStatus,
  type EmployeeSortOption,
  type EmployeeStatusFilter,
} from './useColegiFilter';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { useAuth } from '@/context/useAuth';
import { handleApiError } from '@/utils/apiError';
import type { LucideIcon } from 'lucide-react';
import {
  Search,
  Filter,
  UserPlus,
  Loader2,
  AlertTriangle,
  Users,
  UserCheck,
  Clock3,
  Laptop2,
} from 'lucide-react';
import { cn } from '@/lib/utils';



const EMPLOYEE_STATUS_OPTIONS: { value: EmployeeStatusFilter; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active accounts' },
];

const EMPLOYEE_SORT_OPTIONS: { value: EmployeeSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'created-desc', label: 'Creation date' },
];

const DEFAULT_ROW_HEIGHT = 72;
const TABLE_HEADER_HEIGHT = 56;

const parseStatusParam = (value: string | null): EmployeeStatusFilter => {
  if (!value) return 'all';
  return EMPLOYEE_STATUS_OPTIONS.some((option) => option.value === value)
    ? (value as EmployeeStatusFilter)
    : 'all';
};

const parseSortParam = (value: string | null): EmployeeSortOption => {
  if (!value) return 'name-asc';
  return EMPLOYEE_SORT_OPTIONS.some((option) => option.value === value)
    ? (value as EmployeeSortOption)
    : 'name-asc';
};

export default function Colegi() {
  const { isAuthenticated } = useAuth();
  const queryEnabled = isAuthenticated;

  const {
    data,
    refetch,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAngajati(undefined, { enabled: queryEnabled });
  const colegi: AngajatWithRelations[] = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const employeeMetrics = useMemo(() => {
    if (colegi.length === 0) {
      return { total: 0, active: 0, pending: 0, equipment: 0 };
    }

    return colegi.reduce(
      (acc, coleg) => {
        const status = getEmployeeLifecycleStatus(coleg);
        if (status === 'active') acc.active += 1;
        if (status === 'pending') acc.pending += 1;
        acc.equipment += Array.isArray(coleg.echipamente)
          ? coleg.echipamente.length
          : 0;
        return acc;
      },
      {
        total: colegi.length,
        active: 0,
        pending: 0,
        equipment: 0,
      },
    );
  }, [colegi]);

  const highlightCards = useMemo(
    () =>
      [
        {
          label: 'Colegi înregistrați',
          value: employeeMetrics.total,
          description: 'În platformă',
          icon: Users,
        },
        {
          label: 'Conturi active',
          value: employeeMetrics.active,
          description: 'Cu acces confirmat',
          icon: UserCheck,
        },
        {
          label: 'În așteptare',
          value: employeeMetrics.pending,
          description: 'Invitații ce necesită acțiune',
          icon: Clock3,
        },
        {
          label: 'Echipamente alocate',
          value: employeeMetrics.equipment,
          description: 'Dispozitive în uz',
          icon: Laptop2,
        },
      ] satisfies Array<{
        label: string;
        value: number;
        description: string;
        icon: LucideIcon;
      }>,
    [employeeMetrics],
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const highlightedId = searchParams.get('highlight');
  const initialQuery = searchParams.get('q') ?? '';
  const initialFunctionsParam = searchParams.get('functions');
  const initialFunctions = useMemo(
    () =>
      initialFunctionsParam
        ? initialFunctionsParam
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    [initialFunctionsParam],
  );
  const initialStatus = parseStatusParam(searchParams.get('status'));
  const initialSort = parseSortParam(searchParams.get('sort'));

  const [, setExpanded] = useState<Set<string>>(new Set());
  const [selectedAngajatId, setSelectedAngajatId] = useState<string | null>(null);
  const [replaceData, setReplaceData] = useState<{
    colegId: string;
    equipmentId: string;
    type: string;
  } | null>(null);
  const [editColeg, setEditColeg] = useState<Angajat | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Angajat | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailColeg, setDetailColeg] = useState<AngajatWithRelations | null>(null);
  const deleteMutation = useDeleteAngajat();
  const { toast } = useToast();
  const [pendingPV, setPendingPV] = useState<
    Record<string, { predate: string[]; primite: string[] }>
  >({});
  const pendingPVEmployees = useMemo(() => Object.keys(pendingPV), [pendingPV]);
  const pendingPVTotal = useMemo(
    () =>
      Object.values(pendingPV).reduce(
        (total, entry) =>
          total + (entry?.predate?.length ?? 0) + (entry?.primite?.length ?? 0),
        0,
      ),
    [pendingPV],
  );

  const {
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
  } = useColegiFilter(colegi, {
    initialSearch: initialQuery,
    initialFunctions,
    initialStatus,
    initialSort,
  });
  const filteredCount = filtered.length;
  const hasActiveFilters =
    Boolean(search.trim()) || functieFilter.length > 0 || statusFilter !== 'all';
  const filteredSummary = useMemo(() => {
    if (employeeMetrics.total === 0) return 'Niciun coleg';
    const suffix = filteredCount === 1 ? '' : 'i';
    if (filteredCount === employeeMetrics.total) {
      return `${filteredCount} coleg${suffix}`;
    }
    return `${filteredCount} din ${employeeMetrics.total} coleg${suffix}`;
  }, [employeeMetrics.total, filteredCount]);

  const handledHighlightRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<List>(null);
  const getInitialWidth = () =>
    typeof window !== 'undefined' ? Math.max(window.innerWidth - 64, 320) : 320;
  const getInitialHeight = () => {
    if (typeof window === 'undefined') return 360;
    const viewportHeight = window.innerHeight || 0;
    return Math.max(viewportHeight - 360, 320);
  };
  const [width, setWidth] = useState<number>(getInitialWidth);
  const [height, setHeight] = useState<number>(getInitialHeight);
  const rowHeights = useRef<number[]>([]);

  useEffect(() => {
    const items = getQueue();
    if (items.length === 0) return;
    const grouped: Record<string, { predate: string[]; primite: string[] }> = {};
    for (const item of items) {
      const current = grouped[item.angajatId] || { predate: [], primite: [] };
      grouped[item.angajatId] = {
        predate: [...current.predate, ...(item.predate || [])],
        primite: [...current.primite, ...(item.primite || [])],
      };
    }
    setPendingPV(grouped);
  }, []);

  const addPendingPV = (
    colegId: string,
    change: { predate?: string[]; primite?: string[] },
  ) => {
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
        ? 'SCHIMB'
        : data.primite.length > 0
          ? 'PREDARE_PRIMIRE'
          : 'RESTITUIRE';
    try {
      const url = await genereazaProcesVerbal(colegId, tip, data);
      window.open(url, '_blank');
      toast({ title: 'Proces verbal generat' });
      setPendingPV((prev) => {
        const updated = { ...prev };
        delete updated[colegId];
        return updated;
      });
      removeFromQueue(colegId);
    } catch {
      toast({ title: 'Eroare la generarea procesului verbal', variant: 'destructive' });
    }
  };

  const toggleFunction = useCallback(
    (functie: string, checked: boolean) => {
      setFunctieFilter((prev) => {
        const next = new Set(prev);
        if (checked) {
          next.add(functie);
        } else {
          next.delete(functie);
        }
        return Array.from(next);
      });
    },
    [setFunctieFilter],
  );

  useEffect(() => {
    if (!highlightedId) {
      handledHighlightRef.current = null;
    }
  }, [highlightedId]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      next.set('q', trimmedSearch);
    } else {
      next.delete('q');
    }

    if (functieFilter.length > 0) {
      next.set('functions', functieFilter.join(','));
    } else {
      next.delete('functions');
    }

    if (statusFilter !== 'all') {
      next.set('status', statusFilter);
    } else {
      next.delete('status');
    }

    if (sortOrder !== 'name-asc') {
      next.set('sort', sortOrder);
    } else {
      next.delete('sort');
    }

    const current = searchParams.toString();
    const updated = next.toString();

    if (current !== updated) {
      setSearchParams(next, { replace: true });
    }
  }, [search, functieFilter, statusFilter, sortOrder, searchParams, setSearchParams]);

  useEffect(() => {
    if (!highlightedId || handledHighlightRef.current === highlightedId) return;
    if (!width || !height || filtered.length === 0) return;
    const index = filtered.findIndex((c) => c.id === highlightedId);
    if (index === -1) return;
    handledHighlightRef.current = highlightedId;
    requestAnimationFrame(() => listRef.current?.scrollToItem(index, 'start'));
  }, [filtered, highlightedId, width, height]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const parseSize = (value: string) => Number.parseFloat(value) || 0;

    const computeContentHeight = () => {
      const borderBoxHeight = node.offsetHeight || node.clientHeight || 0;
      if (borderBoxHeight > 0 && typeof window !== 'undefined') {
        const styles = window.getComputedStyle(node);
        const paddingY = parseSize(styles.paddingTop) + parseSize(styles.paddingBottom);
        const borderY =
          parseSize(styles.borderTopWidth) + parseSize(styles.borderBottomWidth);
        const contentHeight = borderBoxHeight - paddingY - borderY;
        if (contentHeight > 0) {
          return contentHeight;
        }
      }

      if (typeof window === 'undefined') return getInitialHeight();
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      return Math.max(viewportHeight - rect.top - 120, 320);
    };

    const updateSize = () => {
      const styles = typeof window !== 'undefined' ? window.getComputedStyle(node) : null;

      const paddingX = styles
        ? parseSize(styles.paddingLeft) + parseSize(styles.paddingRight)
        : 0;
      const borderX = styles
        ? parseSize(styles.borderLeftWidth) + parseSize(styles.borderRightWidth)
        : 0;
      const rawWidth = node.offsetWidth || node.clientWidth || getInitialWidth();
      const contentWidth = Math.max(rawWidth - paddingX - borderX, 320);
      const nextHeight = computeContentHeight();

      setWidth((prev) => (prev !== contentWidth ? contentWidth : prev));
      setHeight((prev) => (prev !== nextHeight ? nextHeight : prev));
    };

    updateSize();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(updateSize);
      observer.observe(node);
    }

    window.addEventListener('resize', updateSize);
    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const getSize = (index: number) => rowHeights.current[index] ?? DEFAULT_ROW_HEIGHT;

  const setSize = (index: number, size: number) => {
    if (rowHeights.current[index] !== size) {
      rowHeights.current[index] = size;
      listRef.current?.resetAfterIndex(index);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Coleg șters' });
      await refetch();
      setExpanded(new Set());
    } catch {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge colegul',
        variant: 'destructive',
      });
    }
  };
  
  const handleScrollToPending = () => {
    const firstId = pendingPVEmployees[0];
    if (!firstId) return;
    const index = filtered.findIndex((c) => c.id === firstId);
    if (index >= 0) {
      listRef.current?.scrollToItem(index, 'start');
    }
  };

  const hasData = filtered.length > 0;
  const hasPendingPV = pendingPVEmployees.length > 0;
  const showSkeleton = isLoading && colegi.length === 0;

  const renderSkeleton = () => (
    <div className="divide-y divide-slate-200">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid min-h-[72px] animate-pulse grid-cols-6 items-center gap-x-4 gap-y-2 bg-white px-3 py-3 sm:grid-cols-12 sm:px-4"
        >
          <div className="order-1 col-span-4 flex items-center gap-3 sm:col-span-4">
            <div className="h-12 w-12 rounded-full bg-slate-200/80" />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded bg-slate-200/90" />
              <div className="h-2.5 w-3/4 rounded bg-slate-200/70" />
            </div>
          </div>
          <div className="order-2 col-span-2 flex justify-end sm:order-6 sm:col-span-1">
            <div className="h-8 w-8 rounded bg-slate-200/70" />
          </div>
          <div className="order-3 col-span-6 h-2.5 rounded bg-slate-200/70 sm:order-2 sm:col-span-2" />
          <div className="order-4 col-span-6 h-2.5 rounded bg-slate-200/70 sm:order-3 sm:col-span-3" />
          <div className="order-5 col-span-3 h-2.5 rounded bg-slate-200/60 sm:order-4 sm:col-span-1" />
          <div className="order-6 col-span-3 h-6 rounded-full bg-slate-200/80 sm:order-5 sm:col-span-1" />
        </div>
      ))}
    </div>
  );

  let content: React.ReactNode = null;

  if (isError) {
    content = (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-lg font-semibold text-foreground">Nu am putut încărca lista de colegi.</p>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">{handleApiError(error)}</p>
        </div>
        <Button onClick={() => refetch()} variant="default" className="rounded-full px-5">
          Reîncearcă
        </Button>
      </div>
    );
  } else if (showSkeleton) {
    content = renderSkeleton();
  } else if (hasData && width > 0 && height > 0) {
    const listHeight = Math.max(height - TABLE_HEADER_HEIGHT, DEFAULT_ROW_HEIGHT * 3);

    content = (
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:hidden">
          Lista colegi
        </div>
        <div className="sticky top-0 z-10 hidden border-b border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-12 sm:items-center">
          <span className="col-span-4">Coleg</span>
          <span className="col-span-2">Departament</span>
          <span className="col-span-3">Contact</span>
          <span className="col-span-1 text-center">Echip.</span>
          <span className="col-span-1">Status</span>
          <span className="col-span-1 text-right">Acțiuni</span>
        </div>
        <List
          ref={listRef}
          height={listHeight}
          width={width}
          itemCount={filtered.length}
          itemSize={getSize}
          overscanCount={6}
        >
          {({ index, style }) => (
            <ColegRow
              coleg={filtered[index]}
              index={index}
              style={style}
              isHighlighted={filtered[index].id === highlightedId}
              setEditColeg={setEditColeg}
              setConfirmDelete={setConfirmDelete}
              handleDelete={handleDelete}
              setSelectedAngajatId={setSelectedAngajatId}
              setSize={setSize}
              pendingPV={pendingPV[filtered[index].id]}
              onGeneratePV={handleGeneratePV}
              onOpenDetails={setDetailColeg}
            />
          )}
        </List>
      </div>
    );
  } else if (!isLoading && !hasData) {
    content = (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center">
        <svg
          width="96"
          height="96"
          viewBox="0 0 96 96"
          aria-hidden="true"
          className="text-primary/20"
        >
          <path
            d="M24 30c0-3.314 2.686-6 6-6h36c3.314 0 6 2.686 6 6v36c0 3.314-2.686 6-6 6H30c-3.314 0-6-2.686-6-6V30z"
            fill="currentColor"
            opacity="0.4"
          />
          <path
            d="M34 40h28M34 50h28M34 60h18"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">Nu există colegi înregistrați.</p>
          <p className="text-sm text-muted-foreground">Adaugă primul membru al echipei pentru a începe să gestionezi echipamentele.</p>
        </div>
        <Button className="mt-4 rounded-full px-5" onClick={() => setShowAddModal(true)}>
          <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" /> Adaugă coleg
        </Button>
      </div>
    );
  }

  const showToolbar = !isError;
  const containerClasses = cn(
    'min-h-[320px] rounded-2xl border bg-white',
    isError ? 'border-dashed border-slate-300 p-6 text-slate-700' : 'border-slate-200',
    !isError && (hasData || showSkeleton) ? 'overflow-hidden p-0' : !isError ? 'p-6' : null,
  );

  return (
    <div className="min-h-screen bg-white pb-12 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Container className="py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Echipa</span>
              <h1 className="text-4xl font-semibold tracking-tight">Colegi</h1>
              <p className="text-sm text-slate-600">
                Monitorizează colegii, statusul conturilor și echipamentele alocate într-un singur loc.
              </p>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="h-11 rounded-full px-6 text-sm font-semibold">
              <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" /> Adaugă coleg
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map(({ label, value, description, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                  {value.toLocaleString('ro-RO')}
                </p>
                <p className="text-xs text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </header>

      <Container className="mt-10 space-y-6">
        {hasPendingPV && !isError && (
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge label="Procese verbale în lucru" tone="warning" withDot />
                <span className="text-sm text-muted-foreground">
                  {pendingPVEmployees.length === 1
                    ? '1 coleg are procese verbale nefinalizate.'
                    : `${pendingPVEmployees.length} colegi au procese verbale nefinalizate.`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleScrollToPending}
                className="rounded-full border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Vezi detalii
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingPVTotal === 1
                ? '1 echipament în așteptare pentru confirmare.'
                : `${pendingPVTotal} echipamente în așteptare pentru confirmare.`}
            </p>
          </div>
        )}

        {showToolbar && (
          <Toolbar className="gap-6">
            <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))] xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
              <div className="space-y-2">
                <div className="relative">
                  <Search
                    className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Caută după nume, rol sau departament"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 text-sm focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-400"
                    aria-label="Search employees"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <span>{filteredSummary}</span>
                  {hasActiveFilters && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Filtre active
                    </span>
                  )}
                </div>
              </div>

<div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 w-full justify-between rounded-xl border border-slate-300 bg-white text-sm font-medium hover:border-slate-400"
                    >
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" aria-hidden="true" />
                        <span>Funcții</span>
                      </div>
                      {functieFilter.length > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {functieFilter.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 rounded-xl border border-slate-200 bg-white">
                    <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
                      Selectează funcțiile
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {functii.length === 0 && (
                      <p className="px-2 py-1.5 text-xs text-muted-foreground">Nu există funcții definite.</p>
                    )}
                    {functii.map((functie) => (
                      <DropdownMenuCheckboxItem
                        key={functie}
                        checked={functieFilter.includes(functie)}
                        onCheckedChange={(checked) => toggleFunction(functie, Boolean(checked))}
                        className="capitalize"
                      >
                        {functie}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EmployeeStatusFilter)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium hover:border-slate-400">
                    <SelectValue placeholder="Status cont" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 bg-white">
                    {EMPLOYEE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as EmployeeSortOption)}>
                  <SelectTrigger className="h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium hover:border-slate-400">
                    <SelectValue placeholder="Sortare" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 bg-white">
                    {EMPLOYEE_SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Toolbar>
        )}

        <div className={containerClasses} ref={!isError ? containerRef : undefined}>
          {!isError && hasData && width === 0 && height === 0 ? renderSkeleton() : content}
        </div>

        {!isError && (
          <div className="flex flex-col items-center gap-3">
            {isFetchingNextPage && (
              <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
            )}
            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="rounded-full px-5"
              >
                {isFetchingNextPage ? 'Se încarcă...' : 'Încarcă mai mulți colegi'}
              </Button>
            )}
          </div>
        )}
      </Container>

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
        detailColeg={detailColeg}
        setDetailColeg={setDetailColeg}
      />
    </div>
  );
}
