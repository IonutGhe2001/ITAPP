import { useState } from "react";
import { createAngajat } from "../../services/angajatiService";

export default function ModalAddColeg({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
  });

  const handleSubmit = async () => {
    await createAngajat(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4">Adaugă coleg</h2>
        <form className="flex flex-col gap-3">
          <input
            placeholder="Nume"
            className="border px-3 py-2 rounded"
            value={formData.nume}
            onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
          />
          <input
            placeholder="Prenume"
            className="border px-3 py-2 rounded"
            value={formData.prenume}
            onChange={(e) => setFormData({ ...formData, prenume: e.target.value })}
          />
          <input
            placeholder="Email"
            className="border px-3 py-2 rounded"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            placeholder="Telefon"
            className="border px-3 py-2 rounded"
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>
              Anulează
            </button>
            <button type="button" className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
