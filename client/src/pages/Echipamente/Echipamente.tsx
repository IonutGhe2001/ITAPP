import { useEffect, useState, type JSX } from "react";
import { FaLaptop, FaMobileAlt, FaSimCard } from "react-icons/fa";
import { getEchipamente, deleteEchipament } from "../../services/echipamenteService";
import { PencilIcon, TrashIcon } from "lucide-react";
import ModalEditEchipament from "./ModalEditEchipament";

function EquipmentCard({ data, icon, onSelect, selected }: any) {
  return (
    <div className={`flex items-center justify-between bg-gray-100 rounded-full px-4 py-2 shadow-sm mb-3 ${selected ? 'ring-2 ring-red-500' : ''}`}>
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(data.id)}
          className="accent-red-600 w-4 h-4"
        />
        <div className="text-red-600 text-xl">{icon}</div>
        <div className="text-sm">
          <p className="font-semibold">{data.nume}</p>
          <p className="text-xs text-gray-600">SN: {data.id}</p>
        </div>
      </div>
      <div className="text-xs text-gray-800">Asignat la: {data.angajat?.nume || "—"}</div>
    </div>
  );
}

export default function Echipamente() {
  const [echipamente, setEchipamente] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    getEchipamente().then((res) => setEchipamente(res.data));
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async () => {
    if (selectedId) {
      await deleteEchipament(selectedId);
      setEchipamente((prev) => prev.filter((e) => e.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleUpdated = (updatedItem: any) => {
    setEchipamente((prev) => prev.map((e) => (e.id === updatedItem.id ? updatedItem : e)));
  };

  const renderList = (tip: string, icon: JSX.Element) => (
    echipamente
      .filter((e) => e.tip === tip)
      .map((e) => (
        <EquipmentCard
          key={e.id}
          data={e}
          icon={icon}
          selected={selectedId === e.id}
          onSelect={handleSelect}
        />
      ))
  );

  const selectedEchipament = echipamente.find((e) => e.id === selectedId);

  return (
    <div className="p-6">

      {selectedId && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg"
          >
            <PencilIcon className="w-4 h-4" /> Editează
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg"
          >
            <TrashIcon className="w-4 h-4" /> Șterge
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h2 className="text-lg text-red-600 font-semibold mb-4">Laptopuri</h2>
          {renderList("laptop", <FaLaptop />)}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h2 className="text-lg text-red-600 font-semibold mb-4">Telefoane</h2>
          {renderList("telefon", <FaMobileAlt />)}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h2 className="text-lg text-red-600 font-semibold mb-4">SIM-uri</h2>
          {renderList("sim", <FaSimCard />)}
        </div>

        <div></div>
      </div>

      {showEditModal && selectedEchipament && (
        <ModalEditEchipament
          onClose={() => setShowEditModal(false)}
          echipament={selectedEchipament}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}