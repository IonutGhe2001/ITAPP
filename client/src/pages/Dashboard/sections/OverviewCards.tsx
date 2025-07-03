"use client";

import { useEffect, useState } from "react";
import { UsersIcon, LaptopIcon } from "lucide-react";
import { getAngajati } from "@/services/angajatiService";
import { getEchipamente } from "@/services/echipamenteService";

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-primary/10 transition-transform hover:scale-[1.03]">
      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${color} text-white mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      <p className="text-4xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function OverviewCards() {
  const [totalAngajati, setTotalAngajati] = useState(0);
  const [totalEchipamente, setTotalEchipamente] = useState(0);

  useEffect(() => {
    getAngajati().then((res) => setTotalAngajati(res.data.length));
    getEchipamente().then((res) => setTotalEchipamente(res.data.length));
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <StatCard
        icon={<UsersIcon className="w-8 h-8" />}
        title="Colegi"
        value={totalAngajati}
        color="bg-primary"
      />
      <StatCard
        icon={<LaptopIcon className="w-8 h-8" />}
        title="Echipamente"
        value={totalEchipamente}
        color="bg-red-600"
      />
    </section>
  );
}
