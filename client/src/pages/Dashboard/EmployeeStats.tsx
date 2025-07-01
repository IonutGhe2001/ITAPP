import { useEffect, useState } from "react";
import { getAngajati } from "../../services/angajatiService";
import { UsersIcon } from "lucide-react";

export default function EmployeeStats() {
  const [angajati, setAngajati] = useState<any[]>([]);

  useEffect(() => {
    getAngajati().then((res) => setAngajati(res.data));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Statistici Colegi</h2>
      <div className="flex items-center gap-4">
        <div className="p-4 bg-blue-100 text-blue-600 rounded-full">
          <UsersIcon className="w-6 h-6" />
        </div>
        <div className="text-sm">
          <p>
            <span className="font-bold text-xl">{angajati.length}</span> Total colegi
          </p>
        </div>
      </div>
    </div>
  );
}
