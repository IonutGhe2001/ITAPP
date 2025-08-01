import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateAngajat } from "@/features/employees";

export default function EmployeeForm() {
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    departament: "",
    dataAngajare: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const mutation = useCreateAngajat();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nume || !form.departament) {
      setError("Numele și departamentul sunt obligatorii");
      return;
    }
    try {
      await mutation.mutateAsync({
        numeComplet: `${form.nume} ${form.prenume}`.trim(),
        functie: form.departament,
        dataAngajare: new Date(form.dataAngajare),
      });
      setSuccess("Angajat salvat cu succes");
      setForm({ nume: "", prenume: "", departament: "", dataAngajare: "" });
    } catch (err) {
      setError("Eroare la salvarea angajatului");
    }
  };

  return (
    <div className="max-w-md mx-auto py-4">
      <h1 className="text-xl font-bold mb-4">Adaugă Angajat</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="nume"
          placeholder="Nume"
          value={form.nume}
          onChange={handleChange}
        />
        <Input
          name="prenume"
          placeholder="Prenume"
          value={form.prenume}
          onChange={handleChange}
        />
        <Input
          name="departament"
          placeholder="Departament"
          value={form.departament}
          onChange={handleChange}
        />
        <Input
          name="dataAngajare"
          type="date"
          value={form.dataAngajare}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <Button type="submit">Salvează</Button>
      </form>
    </div>
  );
}
