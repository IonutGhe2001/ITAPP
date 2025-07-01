import { useEffect, useState } from "react";
import { getEchipamente } from "../../services/echipamenteService";
import { LaptopIcon } from "lucide-react";

export default function EquipmentStats() {
  const [echipamente, setEchipamente] = useState<any[]>([]);

  useEffect(() => {
    getEchipamente().then((res) => setEchipamente(res.data));
  }, []);

  const total = echipamente.length;
  const active = echipamente.filter((e) => e.stare === "predat").length;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Statistici Echipamente</h2>
      <div className="flex items-center gap-4">
        <div className="p-4 bg-red-100 text-red-600 rounded-full">
          <LaptopIcon className="w-6 h-6" />
        </div>
        <div className="text-sm">
          <p>
            <span className="font-bold text-xl">{total}</span> Total echipamente
          </p>
          <p className="text-green-600">
            <span className="font-bold">{active}</span> Echipamente active
          </p>
        </div>
      </div>
    </div>
  );
}
