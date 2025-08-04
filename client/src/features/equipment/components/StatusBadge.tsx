import type { StatusBadgeProps } from '@/features/equipment/types';

const STATUS_STYLES: Record<string, string> = {
  in_stoc: 'bg-green-100 text-green-800',
  mentenanta: 'bg-yellow-100 text-yellow-800',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes = STATUS_STYLES[status] ?? 'bg-blue-100 text-blue-800';

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${classes}`}>
      {status.replace('_', ' ')}
    </span>
  );
}