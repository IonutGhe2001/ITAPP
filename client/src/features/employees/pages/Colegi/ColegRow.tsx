import { useLayoutEffect, useMemo, useRef } from 'react';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Avatar from '@/components/Avatar';
import ActionsMenu from '@/components/ActionsMenu';
import type { Angajat, Echipament } from '@/features/equipment/types';
import type { AngajatWithRelations } from '@/features/employees/angajatiService';
import { cn } from '@/lib/utils';
import { Mail, Phone } from 'lucide-react';
import { getEmployeeLifecycleStatus } from './useColegiFilter';

interface ColegRowProps {
  coleg: Angajat & { echipamente: Echipament[] };
  index: number;
  style: React.CSSProperties;
  isHighlighted?: boolean;
  setEditColeg: (c: Angajat) => void;
  setConfirmDelete: (c: Angajat) => void;
  handleDelete: (id: string) => void;
  setSelectedAngajatId: (id: string) => void;
  setSize: (index: number, size: number) => void;
  pendingPV?: { predate: string[]; primite: string[] };
  onGeneratePV: (colegId: string) => void;
  onOpenDetails: (coleg: AngajatWithRelations) => void;
}

const lifecycleTone = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  inactive: 'bg-neutral-300',
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
  if (
    'departmentName' in coleg &&
    typeof (coleg as { departmentName?: unknown }).departmentName === 'string'
  ) {
    return (coleg as { departmentName: string }).departmentName;
  }
  return '';
};

export default function ColegRow({
  coleg,
  index,
  style,
  isHighlighted = false,
  setEditColeg,
  setConfirmDelete,
  handleDelete,
  setSelectedAngajatId,
  setSize,
  pendingPV,
  onGeneratePV,
  onOpenDetails,
}: ColegRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const lifecycleStatus = getEmployeeLifecycleStatus(coleg as AngajatWithRelations);
  const department = useMemo(() => getDepartmentName(coleg as AngajatWithRelations), [coleg]);
  const pendingPVCount = (pendingPV?.predate?.length ?? 0) + (pendingPV?.primite?.length ?? 0);
  const equipmentCount = Array.isArray(coleg.echipamente) ? coleg.echipamente.length : 0;

  useLayoutEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const measuredHeight = node.getBoundingClientRect().height;

    const parent = node.parentElement;
    let wrapperPadding = 0;

    if (parent && typeof window !== 'undefined') {
      const styles = window.getComputedStyle(parent);
      const parseSize = (value: string) => Number.parseFloat(value) || 0;
      wrapperPadding = parseSize(styles.paddingTop) + parseSize(styles.paddingBottom);
    }

    const nextSize = Math.ceil(measuredHeight + wrapperPadding);
    setSize(index, nextSize);
  }, [index, coleg, setSize]);

  const handleDeleteAction = () => {
    if (coleg.echipamente.length > 0) {
      setConfirmDelete(coleg);
    } else {
      handleDelete(coleg.id);
    }
  };

  const handleOpenDetails = () => onOpenDetails(coleg as AngajatWithRelations);

  const statusIndicatorClass = lifecycleTone[lifecycleStatus];
  const showPendingPV = pendingPVCount > 0;

  return (
    <div style={style} className="px-2 sm:px-4">
      <div
        ref={rowRef}
        role="row"
        className={cn(
          'focus-within:ring-primary/50 grid min-h-[72px] grid-cols-6 items-center gap-x-4 gap-y-2 rounded-lg border-b border-slate-200/70 bg-white px-2 py-3 text-sm transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white hover:bg-slate-50 sm:grid-cols-11 sm:px-4',
          isHighlighted && 'ring-primary/40 ring-2'
        )}
      >
        <div className="order-1 col-span-4 flex items-center gap-3 sm:col-span-4">
          <div className="relative flex-shrink-0">
            <Avatar name={coleg.numeComplet} className="h-12 w-12" />
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white',
                statusIndicatorClass
              )}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleOpenDetails}
              className="hover:text-primary focus-visible:ring-primary/60 line-clamp-1 text-left text-base font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {coleg.numeComplet}
            </button>
            <span className="line-clamp-1 text-xs text-slate-500">{coleg.functie}</span>
          </div>
        </div>
        <div className="order-3 col-span-6 text-sm text-slate-600 sm:order-2 sm:col-span-2">
          {department ? (
            <span className="line-clamp-1">{department}</span>
          ) : (
            <span className="text-slate-400">-</span>
          )}
        </div>
        <div className="order-4 col-span-6 flex flex-col gap-1 text-sm text-slate-600 sm:order-3 sm:col-span-3">
          {coleg.email ? (
            <a
              href={`mailto:${coleg.email}`}
              className="hover:text-primary focus-visible:ring-primary/60 inline-flex items-center gap-1 whitespace-pre-wrap text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="truncate">{coleg.email}</span>
            </a>
          ) : (
            <span className="text-slate-400">-</span>
          )}
          {coleg.telefon && (
            <a
              href={`tel:${coleg.telefon}`}
              className="hover:text-primary focus-visible:ring-primary/60 inline-flex items-center gap-1 whitespace-nowrap text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <Phone className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span>{coleg.telefon}</span>
            </a>
          )}
          {showPendingPV && (
            <button
              type="button"
              onClick={() => onGeneratePV(coleg.id)}
              className="text-left text-xs font-medium text-amber-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Procese verbale ({pendingPVCount})
            </button>
          )}
        </div>
        <div className="order-5 col-span-3 flex items-center gap-2 text-sm font-medium text-slate-700 sm:order-4 sm:col-span-1 sm:justify-center">
          {equipmentCount}
        </div>
        <div className="order-2 col-span-2 flex justify-end sm:order-5 sm:col-span-1">
          <ActionsMenu srLabel={`Acțiuni pentru ${coleg.numeComplet}`}>
            <DropdownMenuItem onSelect={handleOpenDetails}>Vezi profil</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSelectedAngajatId(coleg.id)}>
              Asignează echipament
            </DropdownMenuItem>
            {showPendingPV && (
              <DropdownMenuItem onSelect={() => onGeneratePV(coleg.id)}>
                Generează PV
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => setEditColeg(coleg)}>Editează</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onSelect={handleDeleteAction}>
              Șterge
            </DropdownMenuItem>
          </ActionsMenu>
        </div>
      </div>
    </div>
  );
}
