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
    <section className="flex items-center gap-6">
      <div className="p-4 bg-primary/10 text-primary rounded-xl">
        <LaptopIcon className="w-8 h-8" />
      </div>
      <div className="flex flex-col">
        <h2 className="text-sm font-semibold text-primary">Echipamente</h2>
        <p className="text-xl font-bold text-gray-900">{total} totale</p>
        <p className="text-sm text-primary-dark">{active} active</p>
      </div>
    </section>
  );
}
