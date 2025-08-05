import {
  EQUIPMENT_STATUS_LABELS,
  type EquipmentStatus,
  type StatusBadgeProps,
} from '@/features/equipment/types';

const STATUS_STYLES: Record<EquipmentStatus, string> = {
  in_stoc: 'bg-green-100 text-green-800',
  alocat: 'bg-blue-100 text-blue-800',
  in_comanda: 'bg-purple-100 text-purple-800',
  mentenanta: 'bg-yellow-100 text-yellow-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-800';

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${classes}`}>
      {EQUIPMENT_STATUS_LABELS[status] ?? status.replace('_', ' ')}
    </span>
  );
}