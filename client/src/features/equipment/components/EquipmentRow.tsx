import { useLayoutEffect, useRef } from 'react';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import ActionsMenu from '@/components/ActionsMenu';
import StatusBadge from '@/components/StatusBadge';
import { EquipmentIcon } from './EquipmentIcon';
import type { Echipament } from '@/features/equipment/types';
import { EQUIPMENT_STATUS_LABELS } from '@/features/equipment/types';
import { cn } from '@/lib/utils';
import { User, Calendar } from 'lucide-react';

interface EquipmentRowProps {
  echipament: Echipament;
  index: number;
  style: React.CSSProperties;
  isHighlighted?: boolean;
  onEdit?: (echipament: Echipament & { __editMode?: boolean }) => void;
  onDelete?: (id: string) => void;
  onTransfer?: (echipament: Echipament) => void;
  onViewDetails?: (echipament: Echipament) => void;
  setSize: (index: number, size: number) => void;
}

const getStatusTone = (stare: string) => {
  switch (stare) {
    case 'alocat':
      return 'success';
    case 'in_stoc':
      return 'neutral';
    case 'mentenanta':
      return 'warning';
    case 'in_comanda':
      return 'info';
    default:
      return 'neutral';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export default function EquipmentRow({
  echipament,
  index,
  style,
  isHighlighted = false,
  onEdit,
  onDelete,
  onTransfer,
  onViewDetails,
  setSize,
}: EquipmentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const assignedName = echipament.angajat?.numeComplet || '-';
  const statusLabel = EQUIPMENT_STATUS_LABELS[echipament.stare] || echipament.stare;
  const statusTone = getStatusTone(echipament.stare);

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
  }, [index, echipament, setSize]);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(echipament);
    } else if (onEdit) {
      onEdit({ ...echipament, __editMode: true });
    }
  };

  const handleDeleteAction = () => {
    if (onDelete) {
      onDelete(echipament.id);
    }
  };

  return (
    <div style={style} className="px-2 sm:px-4">
      <div
        ref={rowRef}
        role="row"
        className={cn(
          'focus-within:ring-primary/50 grid min-h-[72px] grid-cols-6 items-center gap-x-4 gap-y-2 rounded-lg border-b border-slate-200/70 bg-white px-2 py-3 text-sm transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white hover:bg-slate-50 sm:grid-cols-12 sm:px-4',
          isHighlighted && 'ring-primary/40 ring-2'
        )}
      >
        <div className="order-1 col-span-4 flex items-center gap-3 sm:col-span-4">
          <div className="flex-shrink-0">
            <EquipmentIcon type={echipament.tip} className="h-10 w-10" />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleViewDetails}
              className="hover:text-primary focus-visible:ring-primary/60 line-clamp-1 text-left text-base font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {echipament.nume}
            </button>
            <span className="line-clamp-1 text-xs text-slate-500">{echipament.tip}</span>
          </div>
        </div>
        <div className="order-3 col-span-6 text-sm text-slate-600 sm:order-2 sm:col-span-2">
          <span className="line-clamp-1">{echipament.serie}</span>
        </div>
        <div className="order-4 col-span-6 flex flex-col gap-1 text-sm text-slate-600 sm:order-3 sm:col-span-3">
          {echipament.angajatId ? (
            <div className="inline-flex items-center gap-1">
              <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
              <span className="truncate">{assignedName}</span>
            </div>
          ) : (
            <span className="text-slate-400">Neasignat</span>
          )}
          {echipament.dataAchizitie && (
            <div className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3 text-slate-400" aria-hidden="true" />
              <span>{formatDate(echipament.dataAchizitie)}</span>
            </div>
          )}
        </div>
        <div className="order-5 col-span-3 flex items-center gap-2 sm:order-4 sm:col-span-2">
          <StatusBadge
            label={statusLabel}
            tone={statusTone}
            withDot
            aria-label={`Status: ${statusLabel}`}
          />
        </div>
        <div className="order-2 col-span-2 flex justify-end sm:order-5 sm:col-span-1">
          <ActionsMenu srLabel={`Acțiuni pentru ${echipament.nume}`}>
            <DropdownMenuItem onSelect={handleViewDetails}>Vezi detalii</DropdownMenuItem>
            {echipament.stare === 'in_stoc' && onTransfer && (
              <DropdownMenuItem onSelect={() => onTransfer(echipament)}>
                Asignează echipament
              </DropdownMenuItem>
            )}
            {echipament.angajatId && onTransfer && (
              <DropdownMenuItem onSelect={() => onTransfer(echipament)}>
                Transferă echipament
              </DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onSelect={() => onEdit({ ...echipament, __editMode: true })}>
                Editează
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onDelete && (
              <DropdownMenuItem className="text-destructive" onSelect={handleDeleteAction}>
                Șterge
              </DropdownMenuItem>
            )}
          </ActionsMenu>
        </div>
      </div>
    </div>
  );
}