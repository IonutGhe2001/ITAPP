
import { useState } from "react";
import { createAngajat } from "../../services/angajatiService";
import { useToast } from "@hooks/use-toast";

export default function ModalAddColeg({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    numeComplet: "",
    functie: "",
    email: "",
    telefon: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
const { toast } = useToast();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.numeComplet.trim().length < 2)
      newErrors.numeComplet = "Numele trebuie să aibă cel puțin 2 caractere.";
    if (formData.functie.trim().length < 2)
      newErrors.functie = "Funcția este obligatorie.";
    if (formData.email && !formData.email.includes("@"))
      newErrors.email = "Emailul nu este valid.";
    if (formData.telefon && formData.telefon.length < 10)
      newErrors.telefon = "Numărul de telefon trebuie să aibă cel puțin 10 caractere.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
  await createAngajat(formData);
  toast({
    title: "Coleg adăugat",
    description: "Coleg adăugat cu succes.",
  });
  onClose();
} catch (err) {
  toast({
    title: "Eroare",
    description: "Eroare la adăugare coleg.",
    variant: "destructive",
  });
}

  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold text-primary mb-4">Adaugă coleg</h2>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              placeholder="Nume complet"
              value={formData.numeComplet}
              onChange={(e) => setFormData({ ...formData, numeComplet: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.numeComplet && <p className="text-xs text-red-500 mt-1">{errors.numeComplet}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Funcție"
              value={formData.functie}
              onChange={(e) => setFormData({ ...formData, functie: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.functie && <p className="text-xs text-red-500 mt-1">{errors.functie}</p>}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Număr de telefon"
              value={formData.telefon}
              onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            />
            {errors.telefon && <p className="text-xs text-red-500 mt-1">{errors.telefon}</p>}
          </div>

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
