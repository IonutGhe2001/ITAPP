import { memo } from 'react';
import EquipmentCard from './EquipmentCard';
import type { EquipmentListProps } from '@/features/equipment/types';

function EquipmentList({ echipamente, onEdit, onDelete, onTransfer, onViewDetails }: EquipmentListProps) {
  if (echipamente.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {echipamente.map((echipament) => (
        <EquipmentCard
          key={echipament.id}
          echipament={echipament}
          onEdit={onEdit}
          onDelete={onDelete}
          onTransfer={onTransfer}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default memo(EquipmentList);
