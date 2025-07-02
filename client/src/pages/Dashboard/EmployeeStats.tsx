import { useEffect, useState } from "react";
import { getAngajati } from "../../services/angajatiService";
import { UsersIcon } from "lucide-react";

export default function EmployeeStats() {
  const [angajati, setAngajati] = useState<any[]>([]);

  useEffect(() => {
    getAngajati().then((res) => setAngajati(res.data));
  }, []);

  return (
    <section className="flex items-center gap-6">
      <div className="p-4 bg-primary/10 text-primary rounded-xl">
        <UsersIcon className="w-8 h-8" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-primary">Colegi</h2>
        <p className="text-xl font-bold text-gray-900">{angajati.length} în total</p>
      </div>
    </section>
  );
}
