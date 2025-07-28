import { memo } from "react";
import type { EquipmentFilterProps } from "@/features/echipamente/types";

function EquipmentFilter({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: EquipmentFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Caută după nume sau serie"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-3/4"
      />
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
      >
        <option value="">Toate statusurile</option>
        <option value="disponibil">Disponibile</option>
        <option value="predat">Predate</option>
        <option value="mentenanta">În mentenanță</option>
      </select>
    </div>
  );
}

export default memo(EquipmentFilter);