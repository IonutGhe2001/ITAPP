import { FaLaptop, FaMobileAlt, FaSimCard } from "react-icons/fa";
import { PencilIcon, TrashIcon } from "lucide-react";

function getIcon(tip: string) {
  const baseStyle = "text-2xl text-primary";
  switch (tip) {
    case "telefon":
      return <FaMobileAlt className={baseStyle} />;
    case "sim":
      return <FaSimCard className={baseStyle} />;
    case "laptop":
    default:
      return <FaLaptop className={baseStyle} />;
  }
}

export default function EquipmentCard({
  echipament,
  onEdit,
  onDelete,
}: {
  echipament: any;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between transition hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div>{getIcon(echipament.tip)}</div>
        <div className="text-sm space-y-1">
          <p className="font-semibold text-gray-900">{echipament.nume}</p>
          <p className="text-xs text-gray-600">Serie: {echipament.serie}</p>
          <p className="text-xs text-gray-600">Tip: {echipament.tip}</p>
          {echipament.angajat && (
            <p className="text-xs text-gray-600">
              Predat la: {echipament.angajat.numeComplet}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            echipament.stare === "disponibil"
              ? "bg-primary/10 text-primary"
              : "bg-primary text-white"
          }`}
        >
          {echipament.stare}
        </span>
        <div className="flex gap-2">
          <button onClick={onEdit} title="Editează">
            <PencilIcon className="w-4 h-4 text-primary hover:text-primary-dark" />
          </button>
          <button onClick={onDelete} title="Șterge">
            <TrashIcon className="w-4 h-4 text-primary hover:text-primary-dark" />
          </button>
        </div>
      </div>
    </div>
  );
}
