import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Echipament, EquipmentSortOption } from '@/features/equipment/types';
import {
  useEchipamente,
  useDeleteEchipament,
  useUpdateEchipament,
  exportEchipamente,
  EquipmentFilter,
  EquipmentList,
  ModalEditEchipament,
  ImportEchipamente,
  ModalPredaEchipament,
} from '@/features/equipment';
import { useToast } from '@/hooks/use-toast/use-toast-hook';
import { handleApiError } from '@/utils/apiError';
import { useAuth } from '@/context/useAuth';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';

const ModalAddEchipament = React.lazy(() => import('@/pages/Dashboard/modals/ModalAddEchipament'));

const SORT_VALUES: EquipmentSortOption[] = ['name-asc', 'name-desc', 'assigned-date', 'status'];

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

const localeCompare = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' });

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
  const [type, setType] = useState(() => searchParams.get('type') ?? '');
  const [sort, setSort] = useState<EquipmentSortOption>(() => parseSortParam(searchParams.get('sort')));

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
    total,
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

  const types = useMemo(() => {
    const unique = new Set<string>();
    echipamente.forEach((eq) => {
      if (typeof eq.tip === 'string') {
        const normalized = eq.tip.trim();
        if (normalized) unique.add(normalized);
      }
    });
    return Array.from(unique).sort(localeCompare);
  }, [echipamente]);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: 'Echipament șters' });
      await refetch();
    } catch (err) {
      toast({ title: 'Eroare la ștergere', description: handleApiError(err), variant: 'destructive' });
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70"
        >
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-3">
              <div className="h-3.5 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-1/4 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const hasFilters = Boolean(search.trim() || status || type);

  const emptyState = (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-12 text-center shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        aria-hidden="true"
        className="text-slate-300 dark:text-slate-700"
      >
        <rect x="18" y="24" width="60" height="48" rx="10" fill="currentColor" opacity="0.35" />
        <path
          d="M30 54h12m6 0h18M30 42h36"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className="mt-4 space-y-2">
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nu există echipamente înregistrate.</p>
        <p className="text-sm text-muted-foreground">Importă un fișier sau adaugă echipamente manual.</p>
      </div>
      <Button className="mt-6 rounded-xl px-4 py-2" onClick={() => setShowAddModal(true)}>
        Adaugă echipament
      </Button>
    </div>
  );

  const content = (() => {
    if (isError) {
      return (
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-12 text-center shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
          <AlertTriangle className="h-10 w-10 text-amber-500" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">Nu am putut încărca echipamentele.</p>
            <p className="mx-auto max-w-md text-sm">{handleApiError(error)}</p>
          </div>
          <Button onClick={() => refetch()} className="rounded-xl px-4 py-2">
            Reîncearcă
          </Button>
        </div>
      );
    }

    if (showSkeleton) {
      return renderSkeleton();
    }

    if (processedEquipment.length === 0) {
      return hasFilters ? (
        <div className="rounded-3xl border border-dashed border-slate-300/70 bg-white/80 p-12 text-center text-sm text-muted-foreground shadow-sm dark:border-slate-700/70 dark:bg-slate-900/60">
          <p>Nu s-au găsit echipamente pentru filtrele selectate.</p>
          <Button className="mt-4 rounded-xl px-4 py-2" onClick={() => setShowAddModal(true)}>
            Adaugă echipament nou
          </Button>
        </div>
      ) : (
        emptyState
      );
    }

    return (
      <EquipmentList
        echipamente={processedEquipment}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTransfer={handleTransfer}
        onViewDetails={(eq) => handleEdit({ ...eq, __editMode: true })}
      />
    );
  })();

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
        <Container className="py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Echipamente</h1>
              <p className="text-sm text-muted-foreground">Administrează parcul de echipamente și asignările curente.</p>
            </div>
          <Button onClick={() => setShowAddModal(true)} className="rounded-xl px-4 py-2 shadow-sm">
              Adaugă echipament
            </Button>
          </div>
        </Container>
      </header>

      <Container className="mt-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <EquipmentFilter
              search={search}
              status={status}
              type={type}
              sort={sort}
              types={types}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onTypeChange={setType}
              onSortChange={setSort}
            />
            {content}
            <div className="flex flex-col items-center gap-3">
              {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />}
              {hasNextPage && (
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                  className="rounded-xl"
                >
                  {isFetchingNextPage ? 'Se încarcă...' : 'Încarcă mai multe'}
                </Button>
              )}
              {total > 0 && (
                <p className="text-xs text-muted-foreground">
                  Afișate {processedEquipment.length} din {total} echipamente
                </p>
              )}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/70">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Exportă inventarul</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Generează un fișier Excel cu toate echipamentele și statusurile curente.
              </p>
              <Button
                className="mt-4 w-full rounded-xl px-4 py-2"
                onClick={async () => {
                  try {
                    await exportEchipamente();
                    toast({ title: 'Export inițiat', description: 'Fișierul Excel este generat.' });
                  } catch (err) {
                    toast({
                      title: 'Eroare la export',
                      description: handleApiError(err),
                      variant: 'destructive',
                    });
                  }
                }}
              >
                Exportă în Excel
              </Button>
            </div>
          <ImportEchipamente onImportSuccess={() => refetch()} />
          </aside>
        </div>
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
