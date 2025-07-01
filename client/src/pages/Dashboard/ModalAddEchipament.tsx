import { useState } from "react";
import { createEchipament } from "../../services/echipamenteService";

export default function ModalAddEchipament({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nume: "",
    tip: "laptop",
    stare: "disponibil",
  });

  const handleSubmit = async () => {
    await createEchipament(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Adaugă echipament</h2>
        <form className="flex flex-col gap-3">
          <input
            placeholder="Nume"
            className="border px-3 py-2 rounded"
            value={formData.nume}
            onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
          />

          <select
            className="border px-3 py-2 rounded"
            value={formData.tip}
            onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
          >
            <option value="laptop">Laptop</option>
            <option value="telefon">Telefon</option>
            <option value="sim">SIM</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={formData.stare}
            onChange={(e) => setFormData({ ...formData, stare: e.target.value })}
          >
            <option value="disponibil">Disponibil</option>
            <option value="predat">Predat</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
              Anulează
            </button>
            <button type="button" className="px-4 py-2 rounded bg-red-600 text-white" onClick={handleSubmit}>
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
