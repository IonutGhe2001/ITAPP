"use client";

import { useEffect, useState, type JSX } from "react";
import { UsersIcon, LaptopIcon } from "lucide-react";
import { getAngajati } from "@/services/angajatiService";
import { getEchipamente } from "@/services/echipamenteService";

export default function OverviewCards() {
  const [totalAngajati, setTotalAngajati] = useState(0);
  const [totalEchipamente, setTotalEchipamente] = useState(0);

  useEffect(() => {
    getAngajati().then((res) => setTotalAngajati(res.data.length));
    getEchipamente().then((res) => setTotalEchipamente(res.data.length));
  }, []);

  const Card = ({
    label,
    value,
    icon,
    iconBg,
    bg,
  }: {
    label: string;
    value: number;
    icon: JSX.Element;
    iconBg: string;
    bg: string;
  }) => (
    <div
      className={`rounded-xl p-4 shadow-sm border border-border flex items-center justify-between min-w-[220px] transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${bg}`}
    >
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 justify-start sm:justify-center">
      <Card
        label="Total angajați"
        value={totalAngajati}
        icon={<UsersIcon className="w-5 h-5 text-white animate-pulse" />}
        iconBg="bg-chart-1"
        bg="bg-chart-1/10"
      />
      <Card
        label="Total echipamente"
        value={totalEchipamente}
        icon={<LaptopIcon className="w-5 h-5 text-white animate-pulse" />}
        iconBg="bg-chart-2"
        bg="bg-chart-2/10"
      />
    </div>
  );
}
