import React, { Suspense, useEffect, useMemo, useState, useLayoutEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VariableSizeList as List } from 'react-window';
import type { Echipament, EquipmentSortOption } from '@/features/equipment/types';
import {
  useEchipamente,
  useDeleteEchipament,
  useUpdateEchipament,
  ModalEditEchipament,
  ModalPredaEchipament,
} from '@/features/equipment';
import EquipmentRow from '@/features/equipment/components/EquipmentRow';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';
import { useAuth } from '@/context/useAuth';
import Container from '@/components/Container';
import Toolbar from '@/components/Toolbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertTriangle, Search, Plus, Laptop2, Package, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const ModalAddEchipament = React.lazy(() => import('@/pages/Dashboard/modals/ModalAddEchipament'));

const SORT_VALUES: EquipmentSortOption[] = ['name-asc', 'name-desc', 'assigned-date', 'status'];

const EQUIPMENT_SORT_OPTIONS: { value: EquipmentSortOption; label: string }[] = [
  { value: 'name-asc', label: 'Nume A–Z' },
  { value: 'name-desc', label: 'Nume Z–A' },
  { value: 'assigned-date', label: 'Data alocării' },
  { value: 'status', label: 'Status' },
];

const EQUIPMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'Toate statusurile' }, // changed from '' to 'all'
  { value: 'alocat', label: 'Alocate' },
  { value: 'in_stoc', label: 'În stoc' },
  { value: 'mentenanta', label: 'În mentenanță' },
  { value: 'in_comanda', label: 'În comandă' },
];

const DEFAULT_ROW_HEIGHT = 72;
const TABLE_HEADER_HEIGHT = 56;

const parseSortParam = (value: string | null): EquipmentSortOption => {
  if (!value) return 'name-asc';
  return SORT_VALUES.includes(value as EquipmentSortOption)
    ? (value as EquipmentSortOption)
    : 'name-asc';
};

const statusOrder: Record<string, number> = {
  alocat: 0,
  in_stoc: 1,
  mentenanta: 2,
  in_comanda: 3,
};

const localeCompare = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

const getAssignedTimestamp = (item: Echipament) => {
  const meta = item.meta as { assignedAt?: string; updatedAt?: string } | undefined;
  if (meta?.assignedAt) {
    const value = Date.parse(meta.assignedAt);
    if (!Number.isNaN(value)) return value;
  }
  if ('assignedAt' in item && typeof (item as { assignedAt?: string }).assignedAt === 'string') {
    const value = Date.parse((item as { assignedAt: string }).assignedAt);
    if (!Number.isNaN(value)) return value;
  }
  if (item.angajatId && meta?.updatedAt) {
    const value = Date.parse(meta.updatedAt);
    if (!Number.isNaN(value)) return value;
  }
  return 0;
};

export default function Echipamente() {
  const { isAuthenticated } = useAuth();
  const queryEnabled = isAuthenticated;

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [status, setStatus] = useState(() => searchParams.get('status') ?? '');
  const [type] = useState(() => searchParams.get('type') ?? '');
  const [sort, setSort] = useState<EquipmentSortOption>(() =>
    parseSortParam(searchParams.get('sort'))
  );

  const requestSort = sort === 'name-desc' ? 'desc' : 'asc';

  const {
    data: echipamente = [],
    refetch,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useEchipamente({
    search: search.trim(),
    status: status || undefined,
    type: type || undefined,
    sort: requestSort,
    autoFetchAll: false,
    pageSize: 30,
    enabled: queryEnabled,
  });

  const [selected, setSelected] = useState<(Echipament & { __editMode?: boolean }) | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [transferEquipment, setTransferEquipment] = useState<Echipament | null>(null);

  const deleteMutation = useDeleteEchipament();
  const updateMutation = useUpdateEchipament();
  const { toast } = useToast();

  const equipmentMetrics = useMemo(() => {
    if (echipamente.length === 0) {
      return { total: 0, allocated: 0, inStock: 0, maintenance: 0 };
    }

    return echipamente.reduce(
      (acc, eq) => {
        if (eq.stare === 'alocat') acc.allocated += 1;
        if (eq.stare === 'in_stoc') acc.inStock += 1;
        if (eq.stare === 'mentenanta') acc.maintenance += 1;
        return acc;
      },
      {
        total: echipamente.length,
        allocated: 0,
        inStock: 0,
        maintenance: 0,
      }
    );
  }, [echipamente]);

  const highlightCards = useMemo(
    () =>
      [
        {
          label: 'Total echipamente',
          value: equipmentMetrics.total,
          description: 'În inventar',
          icon: Laptop2,
        },
        {
          label: 'Alocate',
          value: equipmentMetrics.allocated,
          description: 'Dispozitive în uz',
          icon: Package,
        },
        {
          label: 'În stoc',
          value: equipmentMetrics.inStock,
          description: 'Disponibile',
          icon: Package,
        },
        {
          label: 'În mentenanță',
          value: equipmentMetrics.maintenance,
          description: 'Necesită atenție',
          icon: Wrench,
        },
      ] satisfies Array<{
        label: string;
        value: number;
        description: string;
        icon: LucideIcon;
      }>,
    [equipmentMetrics]
  );

  const processedEquipment = useMemo(() => {
    const list = [...echipamente];
    switch (sort) {
      case 'name-desc':
        return list.sort((a, b) => localeCompare(b.nume ?? '', a.nume ?? ''));
      case 'assigned-date':
        return list.sort((a, b) => getAssignedTimestamp(b) - getAssignedTimestamp(a));
      case 'status':
        return list.sort((a, b) => (statusOrder[a.stare] ?? 99) - (statusOrder[b.stare] ?? 99));
      case 'name-asc':
      default:
        return list.sort((a, b) => localeCompare(a.nume ?? '', b.nume ?? ''));
    }
  }, [echipamente, sort]);

  const showSkeleton = isLoading && echipamente.length === 0;
  const filteredCount = processedEquipment.length;
  const hasActiveFilters = Boolean(search.trim()) || Boolean(status) || Boolean(type);

  const filteredSummary = useMemo(() => {
    if (equipmentMetrics.total === 0) return 'Niciun echipament';
    const suffix = filteredCount === 1 ? '' : 'e';
    if (filteredCount === equipmentMetrics.total) {
      return `${filteredCount} echipament${suffix}`;
    }
    return `${filteredCount} din ${equipmentMetrics.total} echipament${suffix}`;
  }, [equipmentMetrics.total, filteredCount]);

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
    const next = new URLSearchParams(searchParams);
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      next.set('q', trimmedSearch);
    } else {
      next.delete('q');
    }

    if (status) {
      next.set('status', status);
    } else {
      next.delete('status');
    }

    if (type) {
      next.set('type', type);
    } else {
      next.delete('type');
    }

    if (sort !== 'name-asc') {
      next.set('sort', sort);
    } else {
      next.delete('sort');
    }

    const current = searchParams.toString();
    const updated = next.toString();

    if (current !== updated) {
      setSearchParams(next, { replace: true });
    }
  }, [search, status, type, sort, searchParams, setSearchParams]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const parseSize = (value: string) => Number.parseFloat(value) || 0;

    const computeContentHeight = () => {
      const borderBoxHeight = node.offsetHeight || node.clientHeight || 0;
      if (borderBoxHeight > 0 && typeof window !== 'undefined') {
        const styles = window.getComputedStyle(node);
        const paddingY = parseSize(styles.paddingTop) + parseSize(styles.paddingBottom);
        const borderY = parseSize(styles.borderTopWidth) + parseSize(styles.borderBottomWidth);
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

      const paddingX = styles ? parseSize(styles.paddingLeft) + parseSize(styles.paddingRight) : 0;
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
      toast({ title: 'Echipament șters' });
      await refetch();
    } catch (err) {
      toast({
        title: 'Eroare la ștergere',
        description: handleApiError(err),
        variant: 'destructive',
      });
    }
  };

  const handleEdit = async (data: Echipament & { __editMode?: boolean }) => {
    const isQuickUpdate = 'angajatId' in data && data.__editMode !== true;

    if (isQuickUpdate) {
      const payload = {
        nume: data.nume?.trim() || '',
        tip: data.tip?.trim() || '',
        serie: data.serie?.trim() || '',
        angajatId: data.angajatId === null ? null : (data.angajatId ?? null),
        stare: data.stare ?? undefined,
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key as keyof typeof payload] === '') {
          delete payload[key as keyof typeof payload];
        }
      });

      try {
        await updateMutation.mutateAsync({ id: data.id, data: payload });
      } catch (err) {
        toast({
          title: 'Eroare la actualizare',
          description: handleApiError(err),
          variant: 'destructive',
        });
      }
    } else {
      setSelected(data);
    }
  };

  const handleTransfer = (echipament: Echipament) => {
    setTransferEquipment(echipament);
  };

  const renderSkeleton = () => (
    <div className="divide-y divide-slate-200">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid min-h-[72px] animate-pulse grid-cols-6 items-center gap-x-4 gap-y-2 bg-white px-3 py-3 sm:grid-cols-12 sm:px-4"
        >
          <div className="order-1 col-span-4 flex items-center gap-3 sm:col-span-4">
            <div className="h-10 w-10 rounded bg-slate-200/80" />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded bg-slate-200/90" />
              <div className="h-2.5 w-3/4 rounded bg-slate-200/70" />
            </div>
          </div>
          <div className="order-2 col-span-2 flex justify-end sm:order-5 sm:col-span-1">
            <div className="h-8 w-8 rounded bg-slate-200/70" />
          </div>
          <div className="order-3 col-span-6 h-2.5 rounded bg-slate-200/70 sm:order-2 sm:col-span-2" />
          <div className="order-4 col-span-6 h-2.5 rounded bg-slate-200/70 sm:order-3 sm:col-span-3" />
          <div className="order-5 col-span-3 h-6 rounded-full bg-slate-200/80 sm:order-4 sm:col-span-2" />
        </div>
      ))}
    </div>
  );

  const hasData = processedEquipment.length > 0;

  let content: React.ReactNode = null;

  if (isError) {
    content = (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12 text-center">
        <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-foreground text-lg font-semibold">
            Nu am putut încărca echipamentele.
          </p>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">{handleApiError(error)}</p>
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
          Listă echipamente
        </div>
        <div className="sticky top-0 z-10 hidden border-b border-slate-200 bg-white px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-12 sm:items-center">
          <span className="col-span-4">Echipament</span>
          <span className="col-span-2">Serie</span>
          <span className="col-span-3">Asignat / Data</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1 text-right">Acțiuni</span>
        </div>
        <List
          ref={listRef}
          height={listHeight}
          width={width}
          itemCount={processedEquipment.length}
          itemSize={getSize}
          overscanCount={6}
        >
          {({ index, style }) => (
            <EquipmentRow
              echipament={processedEquipment[index]}
              index={index}
              style={style}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTransfer={handleTransfer}
              onViewDetails={(eq) => handleEdit({ ...eq, __editMode: true })}
              setSize={setSize}
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
          <p className="text-foreground text-lg font-semibold">
            {hasActiveFilters
              ? 'Nu s-au găsit echipamente.'
              : 'Nu există echipamente înregistrate.'}
          </p>
          <p className="text-muted-foreground text-sm">
            {hasActiveFilters
              ? 'Ajustează filtrele pentru a găsi echipamentele dorite.'
              : 'Adaugă primul echipament pentru a începe să gestionezi inventarul.'}
          </p>
        </div>
        <Button className="mt-4 rounded-full px-5" onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Adaugă echipament
        </Button>
      </div>
    );
  }

  const showToolbar = !isError;
  const containerClasses = cn(
    'min-h-[320px] rounded-2xl border bg-white',
    isError ? 'border-dashed border-slate-300 p-6 text-slate-700' : 'border-slate-200',
    !isError && (hasData || showSkeleton) ? 'overflow-hidden p-0' : !isError ? 'p-6' : null
  );

  // Map empty-string status to 'all' for the UI Select to avoid Radix empty value constraint
  const uiStatusValue = status === '' ? 'all' : status;

  return (
    <div className="min-h-screen bg-white pb-12 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <Container className="py-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Inventar
              </span>
              <h1 className="text-4xl font-semibold tracking-tight">Echipamente</h1>
              <p className="text-sm text-slate-600">
                Administrează parcul de echipamente, statusurile și asignările într-un singur loc.
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="h-11 rounded-full px-6 text-sm font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Adaugă echipament
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {highlightCards.map(({ label, value, description, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                  </span>
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
        {showToolbar && (
          <Toolbar className="gap-6">
            <div className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))] xl:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]">
              <div className="space-y-2">
                <div className="relative">
                  <Search
                    className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Caută după nume, tip sau serie"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 text-sm focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-400"
                    aria-label="Search equipment"
                  />
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide">
                  <span>{filteredSummary}</span>
                  {hasActiveFilters && (
                    <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                      Filtre active
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Select
                  value={uiStatusValue}
                  onValueChange={(value) => setStatus(value === 'all' ? '' : value)}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium hover:border-slate-400">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 bg-white">
                    {EQUIPMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={sort}
                  onValueChange={(value) => setSort(value as EquipmentSortOption)}
                >
                  <SelectTrigger className="h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-medium hover:border-slate-400">
                    <SelectValue placeholder="Sortare" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200 bg-white">
                    {EQUIPMENT_SORT_OPTIONS.map((option) => (
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
              <Loader2 className="text-primary h-5 w-5 animate-spin" aria-hidden="true" />
            )}
            {hasNextPage && (
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                className="rounded-full px-5"
              >
                {isFetchingNextPage ? 'Se încarcă...' : 'Încarcă mai multe echipamente'}
              </Button>
            )}
          </div>
        )}
      </Container>

      {selected && (
        <ModalEditEchipament
          echipament={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            void refetch();
          }}
        />
      )}

      {transferEquipment && (
        <ModalPredaEchipament
          echipament={transferEquipment}
          onClose={() => setTransferEquipment(null)}
          onSubmit={(data) => {
            handleEdit(data);
            setTransferEquipment(null);
            void refetch();
          }}
        />
      )}

      <Suspense fallback={null}>
        {showAddModal && (
          <ModalAddEchipament onClose={() => setShowAddModal(false)} defaultName={search.trim()} />
        )}
      </Suspense>
    </div>
  );
}