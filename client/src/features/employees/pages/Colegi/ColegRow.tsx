import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Avatar from '@/components/Avatar';
import ActionsMenu from '@/components/ActionsMenu';
import StatusBadge from '@/components/StatusBadge';
import { EquipmentIcon } from '@/features/equipment';
import type { Angajat, Echipament } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';
import { useUpdateAngajat } from '@/features/employees';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Laptop2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from 'lucide-react';
import { getEmployeeLifecycleStatus } from './useColegiFilter';

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
  isHighlighted?: boolean;
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
  onOpenDetails: (coleg: AngajatWithRelations) => void;
}

const lifecycleTone = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  inactive: 'bg-slate-400',
} as const;

const getDepartmentName = (coleg: AngajatWithRelations) => {
  if ('department' in coleg) {
    const department = (coleg as unknown as { department?: unknown }).department;
    if (typeof department === 'string') return department;
    if (department && typeof department === 'object' && 'name' in department) {
      const name = (department as { name?: unknown }).name;
      if (typeof name === 'string') return name;
    }
  }
  if ('departmentName' in coleg && typeof (coleg as { departmentName?: unknown }).departmentName === 'string') {
    return (coleg as { departmentName: string }).departmentName;
  }
  return '';
};

export default function ColegRow({
  coleg,
  index,
  style,
  expanded,
  isHighlighted = false,
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
  onOpenDetails,
}: ColegRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const updateAngajat = useUpdateAngajat();
  const lifecycleStatus = getEmployeeLifecycleStatus(coleg as AngajatWithRelations);
  const department = useMemo(() => getDepartmentName(coleg as AngajatWithRelations), [coleg]);
  const pendingPVCount = (pendingPV?.predate?.length ?? 0) + (pendingPV?.primite?.length ?? 0);

  useLayoutEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const measuredHeight = node.getBoundingClientRect().height;

    const parent = node.parentElement;
    let wrapperPadding = 24;

    if (parent && typeof window !== 'undefined') {
      const styles = window.getComputedStyle(parent);
      const parseSize = (value: string) => Number.parseFloat(value) || 0;
      wrapperPadding = parseSize(styles.paddingTop) + parseSize(styles.paddingBottom);
    }

    const nextSize = Math.ceil(measuredHeight + wrapperPadding);
    setSize(index, nextSize);
  }, [index, coleg, expanded, setSize]);

  const handleDeleteAction = () => {
    if (coleg.echipamente.length > 0) {
      setConfirmDelete(coleg);
    } else {
      handleDelete(coleg.id);
    }
  };

  const handleToggleExpand = () => toggleExpand(coleg.id, index);

  const handleOpenDetails = () => onOpenDetails(coleg as AngajatWithRelations);

  const statusIndicatorClass = lifecycleTone[lifecycleStatus];

  const emailBadge = coleg.emailAccountStatus
    ? coleg.emailAccountStatus === 'PENDING'
      ? { label: 'Email pending', tone: 'warning' as const }
      : { label: 'Email activ', tone: 'success' as const }
    : null;

  const showPendingPV = pendingPVCount > 0;

  return (
    <div style={style} className="px-3 py-3">
      <article
        ref={rowRef}
        className={cn(
          'relative flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm ring-1 ring-inset ring-white/70 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-slate-800/70 dark:bg-slate-900/70 dark:ring-0 dark:focus-within:ring-offset-slate-900',
          isHighlighted && 'ring-2 ring-primary/50',
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative flex-shrink-0">
            <Avatar name={coleg.numeComplet} className="h-16 w-16" />
            <span
              className={cn(
                'absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white shadow dark:border-slate-900',
                statusIndicatorClass,
              )}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleOpenDetails}
                className="text-left text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-50 dark:focus-visible:ring-offset-slate-900"
              >
                {coleg.numeComplet}
              </button>
              <ActionsMenu srLabel={`Acțiuni pentru ${coleg.numeComplet}`}>
                <DropdownMenuItem onSelect={handleOpenDetails}>Profil angajat</DropdownMenuItem>
                <DropdownMenuItem onSelect={handleToggleExpand}>
                  {expanded ? 'Ascunde echipamentele' : 'Vezi echipamentele'}
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSelectedAngajatId(coleg.id)}>
                  Asignează echipament
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setEditColeg(coleg)}>Editează</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={handleDeleteAction}>
                  Șterge
                </DropdownMenuItem>
              </ActionsMenu>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1 font-medium">
                <UserRound className="h-4 w-4" aria-hidden="true" />
                {coleg.functie}
              </span>
              {department && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {department}
                </span>
              )}
              <StatusBadge label={lifecycleStatus === 'active' ? 'Activ' : lifecycleStatus === 'pending' ? 'În așteptare' : 'Inactiv'} tone={lifecycleStatus === 'active' ? 'success' : lifecycleStatus === 'pending' ? 'warning' : 'neutral'} withDot />
            </div>

            <div className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              {coleg.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <a href={`mailto:${coleg.email}`} className="hover:underline">
                    {coleg.email}
                  </a>
                </div>
              )}
              {coleg.telefon && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <a href={`tel:${coleg.telefon}`} className="hover:underline">
                    {coleg.telefon}
                  </a>
                </div>
              )}
              {coleg.cDataUsername && (
                <div className="flex items-center gap-2">
                  <Laptop2 className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span className="truncate">c-data: {coleg.cDataUsername}</span>
                </div>
              )}
              {coleg.cDataId && (
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <span>ID: {coleg.cDataId}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>
                Cont c-data: {coleg.cDataCreated ? 'Creat' : 'Necreat'}
                {!coleg.cDataCreated && coleg.emailAccountStatus !== 'PENDING' && (
                  <button
                    type="button"
                    onClick={() =>
                      updateAngajat.mutate({
                        id: coleg.id,
                        data: { cDataCreated: true },
                      })
                    }
                    className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary transition hover:bg-primary/20"
                  >
                    Marchează creat
                  </button>
                )}
              </span>
              {emailBadge && <StatusBadge label={emailBadge.label} tone={emailBadge.tone} />}
              {coleg.emailAccountStatus === 'CREATED' && coleg.emailAccountLink && (
                <a
                  href={coleg.emailAccountLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Deschide e-mail
                </a>
              )}
            {coleg.cDataNotes && <span className="line-clamp-1">{coleg.cDataNotes}</span>}
              {showPendingPV && (
                <StatusBadge label="Proces verbal în așteptare" tone="warning" withDot />
              )}
            </div>
          </div>
        </div>

        {expanded && (
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
            {coleg.echipamente.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Nu are echipamente alocate.
              </div>
            ) : (
              <div className="grid gap-3">
                {coleg.echipamente.map((echipament) => (
                  <div
                    key={echipament.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/80 p-3 shadow-sm transition hover:border-primary/30 dark:border-slate-700/60 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary">
                        <EquipmentIcon type={echipament.tip} className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{echipament.nume}</p>
                        <p className="text-xs text-muted-foreground">Serie: {echipament.serie}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        label={echipament.tip}
                        tone="info"
                        className="uppercase"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEquipment(echipament.id, coleg.id)}
                          className="h-7 rounded-lg px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
                        >
                          Elimină
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplaceData({ colegId: coleg.id, equipmentId: echipament.id, type: echipament.tip })
                          }
                          className="h-7 rounded-lg px-2 text-xs text-primary hover:bg-primary/10"
                        >
                          Schimbă
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="flex items-center gap-1 rounded-lg text-sm text-primary hover:bg-primary/10"
          >
            {expanded ? 'Ascunde echipamentele' : 'Vezi echipamentele'}
            {expanded ? (
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {showPendingPV && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGeneratePV(coleg.id)}
                className="rounded-lg text-sm text-primary hover:bg-primary/10"
              >
                Generează PV
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedAngajatId(coleg.id)}
              className="rounded-lg border-slate-200/80 bg-white/80 text-sm shadow-sm hover:bg-slate-100 dark:border-slate-700/70 dark:bg-slate-900/70"
            >
              Asignează echipament
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
