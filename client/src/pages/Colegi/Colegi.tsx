import { useEffect, useState } from "react";
import profileIcon from "@assets/profile.png";
import { getAngajati } from "../../services/angajatiService";

export default function Colegi() {
  const [colegi, setColegi] = useState<any[]>([]);

  useEffect(() => {
    getAngajati().then((res) => setColegi(res.data));
  }, []);

  return (
    <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colegi.map((coleg) => (
          <div
            key={coleg.id}
            className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
          >
            <img src={profileIcon} alt="avatar" className="w-16 h-16 rounded-full" />

            <div className="flex-1">
              <p className="font-semibold">{coleg.nume} {coleg.prenume}</p>
              <p className="text-sm text-gray-600">{coleg.rol || "Rol necunoscut"}</p>
              <p className="text-sm text-gray-600">{coleg.email}</p>
              <p className="text-sm text-gray-600">{coleg.telefon}</p>
              <p className="text-sm text-red-600 font-semibold mt-1 cursor-pointer">
                Vezi echipamente
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
