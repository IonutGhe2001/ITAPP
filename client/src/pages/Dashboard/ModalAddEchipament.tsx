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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold text-primary mb-4">Adaugă echipament</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Nume"
            value={formData.nume}
            onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={formData.tip}
            onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="laptop">Laptop</option>
            <option value="telefon">Telefon</option>
            <option value="sim">SIM</option>
          </select>

          <select
            value={formData.stare}
            onChange={(e) => setFormData({ ...formData, stare: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="disponibil">Disponibil</option>
            <option value="predat">Predat</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Anulează
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
              onClick={handleSubmit}
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
