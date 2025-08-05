import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { EquipmentIcon, StatusBadge, type EquipmentCardProps } from '@/features/equipment';

function EquipmentCard({ echipament, onEdit, onDelete }: EquipmentCardProps) {
  const icon = useMemo(
    () => <EquipmentIcon type={echipament.tip} className="text-primary text-2xl" />,
    [echipament.tip]
  );

  return (
     <div className="bg-card relative rounded-2xl shadow-md transition hover:shadow-lg">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="hover:bg-muted absolute right-2 top-2 rounded p-1">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit?.({ ...echipament, __editMode: true })}>
            <Pencil className="h-4 w-4" />
            <span>Editează</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete?.(echipament.id)} className="text-destructive">
            <Trash2 className="h-4 w-4" />
            <span>Șterge</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        to={ROUTES.EQUIPMENT_DETAIL.replace(':id', echipament.id)}
        className="flex items-center gap-4 p-5"
      >
        <div>{icon}</div>
        <div className="space-y-1 text-sm">
          <p className="text-foreground font-semibold">{echipament.nume}</p>
          <p className="text-muted-foreground text-xs">Serie: {echipament.serie}</p>
          {echipament.angajat && (
            <p className="text-muted-foreground text-xs">
              Predat la: {echipament.angajat.numeComplet}
            </p>
          )}
        </div>
        <div className="ml-auto">
          <StatusBadge status={echipament.stare} />
        </div>
      </Link>
      </div>
  );
}

export default memo(EquipmentCard);
