import { useState } from "react";
import ModalAddColeg from "./ModalAddColeg";
import ModalAddEchipament from "./ModalAddEchipament";

export default function QuickActions() {
  const [showColegModal, setShowColegModal] = useState(false);
  const [showEchipamentModal, setShowEchipamentModal] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Funcții rapide</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowColegModal(true)}
          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          Adaugă coleg
        </button>
        <button
          onClick={() => setShowEchipamentModal(true)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Adaugă echipament
        </button>
      </div>

      {showColegModal && <ModalAddColeg onClose={() => setShowColegModal(false)} />}
      {showEchipamentModal && <ModalAddEchipament onClose={() => setShowEchipamentModal(false)} />}
    </div>
  );
}
