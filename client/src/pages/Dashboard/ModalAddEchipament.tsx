
import { useEffect, useState } from "react";
import { createEchipament } from "../../services/echipamenteService";
import { getAngajati } from "../../services/angajatiService";
import { useToast } from "../../components/ToastProvider";

export default function ModalAddEchipament({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    nume: "",
    serie: "",
    tip: "laptop",
    angajatId: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [angajati, setAngajati] = useState([]);
  const toast = useToast();

  useEffect(() => {
    getAngajati().then((res) => setAngajati(res.data));
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nume.trim()) newErrors.nume = "Numele este obligatoriu.";
    if (!formData.serie.trim()) newErrors.serie = "Seria este obligatorie.";
    if (!["laptop", "telefon", "sim"].includes(formData.tip))
      newErrors.tip = "Tipul nu este valid.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      angajatId: formData.angajatId || null,
    };

    try {
      await createEchipament(payload);
      toast("Echipament adăugat", "success");
      onClose();
    } catch (err) {
      toast("Eroare la adăugare echipament", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold text-primary mb-4">Adaugă echipament</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              placeholder="Nume echipament"
              value={formData.nume}
              onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              
            />
            {errors.nume && <p className="text-xs text-red-500 mt-1">{errors.nume}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Serie"
              value={formData.serie}
              onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              
            />
            {errors.serie && <p className="text-xs text-red-500 mt-1">{errors.serie}</p>}
          </div>

          <div>
            <select
              value={formData.tip}
              onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            >
              <option value="laptop">Laptop</option>
              <option value="telefon">Telefon</option>
              <option value="sim">SIM</option>
            </select>
            {errors.tip && <p className="text-xs text-red-500 mt-1">{errors.tip}</p>}
          </div>

          <select
            value={formData.angajatId}
            onChange={(e) => setFormData({ ...formData, angajatId: e.target.value })}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="">Fără angajat (disponibil)</option>
            {angajati.map((a: any) => (
              <option key={a.id} value={a.id}>
                {a.numeComplet}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Anulează
            </button>
            <button
              onClick={handleSubmit}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
            >
              Salvează
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
