import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EquipmentIcon } from '@/features/equipment';
import { ROUTES } from '@/constants/routes';
import type { EquipmentCardProps } from '@/features/equipment/types';

function EquipmentCard({ echipament }: EquipmentCardProps) {

  const icon = useMemo(
    () => <EquipmentIcon type={echipament.tip} className="text-primary text-2xl" />,
    [echipament.tip]
  );

  return (
    <Link
      to={ROUTES.EQUIPMENT_DETAIL.replace(':id', echipament.id)}
      className="bg-card flex items-center gap-4 rounded-2xl p-5 shadow-md transition hover:shadow-lg"
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

      </Link>
  );
}

export default memo(EquipmentCard);
