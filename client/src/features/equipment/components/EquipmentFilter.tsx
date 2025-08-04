import { memo } from 'react';
import type { EquipmentFilterProps } from '@/features/equipment/types';
import { EQUIPMENT_STATUS, EQUIPMENT_STATUS_LABELS } from '@/features/equipment/types';

function EquipmentFilter({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: EquipmentFilterProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        placeholder="Caută după nume sau serie"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:w-1/2"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:w-1/4"
      >
        <option value="">Toate statusurile</option>
        <option value={EQUIPMENT_STATUS.IN_STOC}>
          {EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.IN_STOC]}
        </option>
        <option value={EQUIPMENT_STATUS.ALOCAT}>
          {EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.ALOCAT]}
        </option>
        <option value={EQUIPMENT_STATUS.MENTENANTA}>
          {EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.MENTENANTA]}
        </option>
      </select>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 sm:w-1/4"
      >
        <option value="asc">Nume A-Z</option>
        <option value="desc">Nume Z-A</option>
      </select>
    </div>
  );
}

export default memo(EquipmentFilter);
