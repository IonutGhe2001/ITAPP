import EquipmentCard from "./EquipmentCard";
import type { EquipmentListProps } from "@/features/echipamente/types";

export default function EquipmentList({
  echipamente,
  onEdit,
  onDelete,
}: EquipmentListProps) {
  if (echipamente.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 mt-10">
        Nu există echipamente înregistrate.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {echipamente.map((eq) => (
        <EquipmentCard
          key={eq.id}
          echipament={eq}
          onEdit={(val) => {
            if (typeof val === "object") {
              onEdit?.(val);
            } else {
              onEdit?.(eq);
            }
          }}
          onDelete={() => onDelete?.(eq.id)}
        />
      ))}
    </div>
  );
}
