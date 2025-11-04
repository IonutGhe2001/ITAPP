import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import ActionsMenu from '@/components/ActionsMenu';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/StatusBadge';
import { EquipmentIcon, StatusBadge as EquipmentStatusBadge } from '@/features/equipment';
import type { EquipmentCardProps, Echipament } from '@/features/equipment/types';
import { cn } from '@/lib/utils';

const STATUS_TONE: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  alocat: 'info',
  in_stoc: 'success',
  mentenanta: 'warning',
  in_comanda: 'neutral',
};

const getAssignedLabel = (echipament: Echipament) => {
  if (echipament.angajat) {
    return echipament.angajat.numeComplet;
  }
  return 'Neasignat';
};

function EquipmentCard({
  echipament,
  onEdit,
  onDelete,
  onTransfer,
  onViewDetails,
}: EquipmentCardProps) {
  const icon = useMemo(
    () => <EquipmentIcon type={echipament.tip} className="h-6 w-6" />,
    [echipament.tip],
  );

  const assignedLabel = getAssignedLabel(echipament);

  return (
     <article className="group flex h-full flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800/70 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{echipament.nume}</h3>
            <p className="text-xs text-muted-foreground">Serie: {echipament.serie}</p>
            {echipament.numarInventar && (
              <p className="text-xs text-muted-foreground">Inventar: {echipament.numarInventar}</p>
            )}
          </div>
        </div>
        <ActionsMenu srLabel={`Acțiuni pentru ${echipament.nume}`}>
          <DropdownMenuItem
            onSelect={() => {
              if (onViewDetails) {
                onViewDetails(echipament);
              } else {
                onEdit?.({ ...echipament, __editMode: true });
              }
            }}
          >
            Detalii
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onEdit?.({ ...echipament, __editMode: true })}>Editează</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onTransfer?.(echipament)}>Transferă</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onSelect={() => onDelete?.(echipament.id)}>
            Șterge
          </DropdownMenuItem>
        </ActionsMenu>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-medium text-slate-600 dark:text-slate-300">Asignat la</span>
            <div>
              {echipament.angajat ? (
                <Link
                  to={`${ROUTES.COLEGI}?highlight=${echipament.angajat.id}`}
                  className="text-primary hover:underline"
                >
                  {assignedLabel}
                </Link>
              ) : (
                <span>{assignedLabel}</span>
              )}
            </div>
          </div>
          <EquipmentStatusBadge status={echipament.stare} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge
            label={echipament.tip}
            tone={STATUS_TONE[echipament.stare] ?? 'neutral'}
            className={cn('uppercase', echipament.tip ? '' : 'hidden')}
          />
          {echipament.dataAchizitie && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800/80 dark:text-slate-300">
              Achiziționat: {new Date(echipament.dataAchizitie).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      </article>
  );
}

export default memo(EquipmentCard);
