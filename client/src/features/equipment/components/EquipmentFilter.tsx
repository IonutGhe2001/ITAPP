import { memo } from "react";
import type { EquipmentFilterProps } from "@/features/equipment/types";

function EquipmentFilter({
  search,
  status,
  sort,
  onSearchChange,
  onStatusChange,
  onSortChange,
}: EquipmentFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Caută după nume sau serie"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/2"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
      >
        <option value="">Toate statusurile</option>
        <option value="in_stoc">În stoc</option>
        <option value="alocat">Alocate</option>
        <option value="mentenanta">În mentenanță</option>
      </select>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
      >
        <option value="asc">Nume A-Z</option>
        <option value="desc">Nume Z-A</option>
      </select>
    </div>
  );
}

export default memo(EquipmentFilter);