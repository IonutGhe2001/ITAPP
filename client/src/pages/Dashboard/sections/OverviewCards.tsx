"use client";

import { type JSX } from "react";
import {
  UsersIcon,
  LaptopIcon,
  CheckCircle2Icon,
  MinusCircleIcon,
} from "lucide-react";
import { useAngajati } from "@/services/angajatiService";
import { useEchipamente } from "@/services/echipamenteService";

type Echipament = {
  id: string;
  tip: string;
  stare: string;
};

export default function OverviewCards() {
 const { data: angajati } = useAngajati();
  const { data: echipamente } = useEchipamente();

  const angajatiCount = angajati?.length ?? 0;
  const total = echipamente?.length ?? 0;
  const disponibile = echipamente?.filter((e: Echipament) => e.stare === "disponibil").length ?? 0;
  const predate = echipamente?.filter((e: Echipament) => e.angajatId).length ?? 0;
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
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Card
        label="Total angajați"
        value={angajatiCount}
        icon={<UsersIcon className="w-5 h-5 text-white" />}
        iconBg="bg-chart-1"
        bg="bg-chart-1/10"
      />
      <Card
        label="Total echipamente"
        value={total}
        icon={<LaptopIcon className="w-5 h-5 text-white" />}
        iconBg="bg-chart-2"
        bg="bg-chart-2/10"
      />
      <Card
        label="Disponibile"
        value={disponibile}
        icon={<CheckCircle2Icon className="w-5 h-5 text-white" />}
        iconBg="bg-green-600"
        bg="bg-green-100"
      />
      <Card
        label="Predate"
        value={predate}
        icon={<MinusCircleIcon className="w-5 h-5 text-white" />}
        iconBg="bg-red-600"
        bg="bg-red-100"
      />
    </div>
  );
}
