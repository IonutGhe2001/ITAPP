import { memo, useMemo } from 'react';
import {
  EquipmentIcon,
  StatusBadge,
  EquipmentActions,
  useEquipmentCardModals,
} from '@/features/equipment';
import type { EquipmentCardProps } from '@/features/equipment/types';

function EquipmentCard({ echipament, onEdit, onDelete, onRefresh }: EquipmentCardProps) {
  const { openAllocation, openRecupereaza, allocationModal, recupereazaModal } =
    useEquipmentCardModals({ echipament, onEdit, onRefresh });

  const icon = useMemo(
    () => <EquipmentIcon type={echipament.tip} className="text-primary text-2xl" />,
    [echipament.tip]
  );

  return (
    <div className="bg-card flex items-center justify-between rounded-2xl p-5 shadow-md transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div className="space-y-1 text-sm">
          <p className="text-foreground font-semibold">{echipament.nume}</p>
          <p className="text-muted-foreground text-xs">Serie: {echipament.serie}</p>
          <p className="text-muted-foreground text-xs">Tip: {echipament.tip}</p>
          {echipament.angajat && (
            <p className="text-muted-foreground text-xs">
              Predat la: {echipament.angajat.numeComplet}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={echipament.stare} />
        <EquipmentActions
          echipament={echipament}
          onEdit={onEdit}
          onDelete={onDelete}
          onAllocate={openAllocation}
          onRecupereaza={openRecupereaza}
        />
      </div>

      {allocationModal}
      {recupereazaModal}
    </div>
  );
}

export default memo(EquipmentCard);
