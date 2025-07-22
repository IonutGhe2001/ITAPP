import type { EquipmentTabsProps } from "@/features/echipamente/types";

export default function EquipmentTabs({ active, onChange }: EquipmentTabsProps) {
  const tabs = ["toate", "laptop", "telefon", "sim"];

  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tip) => (
        <button
          key={tip}
          onClick={() => onChange(tip)}
          className={`px-4 py-1.5 rounded-full text-sm capitalize transition ${
            active === tip
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tip}
        </button>
      ))}
    </div>
  );
}
