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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold text-primary mb-4">Adaugă coleg</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Nume"
            value={formData.nume}
            onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Prenume"
            value={formData.prenume}
            onChange={(e) => setFormData({ ...formData, prenume: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="tel"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
