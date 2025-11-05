import StatusBadge from '@/components/StatusBadge';
import type { StatusBadgeTone } from '@/components/StatusBadge';
import {
  EQUIPMENT_STATUS_LABELS,
  type EquipmentStatus,
  type StatusBadgeProps,
} from '@/features/equipment/types';

const toneMap: Partial<Record<EquipmentStatus, StatusBadgeTone>> = {
  in_stoc: 'success',
  alocat: 'info',
  in_comanda: 'warning',
  mentenanta: 'danger',
};

export default function EquipmentStatusBadge({ status }: StatusBadgeProps) {
  return (
    <StatusBadge
      label={EQUIPMENT_STATUS_LABELS[status] ?? status.replace('_', ' ')}
      tone={toneMap[status] ?? 'neutral'}
      withDot
    />
  );
}
