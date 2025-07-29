"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "@components/ui/theme-provider-utils";
import { useAngajati } from "@/features/employees";
import { useEchipamente } from "@/features/equipment";
import type { Echipament } from "@/features/equipment";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getCssVar = (name: string) =>
  typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : "";

export default function OverviewCards() {
  const { data: angajati } = useAngajati();
  const { data: echipamente } = useEchipamente();

  const angajatiCount = angajati?.length ?? 0;
  const total = echipamente?.length ?? 0;
  const disponibile = echipamente?.filter((e: Echipament) => e.stare === "disponibil").length ?? 0;
  const predate = echipamente?.filter((e: Echipament) => e.angajatId).length ?? 0;
  const { resolvedTheme } = useTheme();

  const data = useMemo(
    () => {
      void resolvedTheme;
      return {
      labels: ["Angajați", "Echipamente", "Disponibile", "Predate"],
      datasets: [
        {
          label: "Număr",
          data: [angajatiCount, total, disponibile, predate],
          backgroundColor: [
            `hsl(${getCssVar("--chart-1")})`,
            `hsl(${getCssVar("--chart-2")})`,
            `hsl(${getCssVar("--chart-4")})`,
            `hsl(${getCssVar("--chart-5")})`,
          ],
        },
      ],
      };
    },
    [angajatiCount, total, disponibile, predate, resolvedTheme]
  );

  const options = useMemo(() => {
    void resolvedTheme;
    const textColor = `hsl(${getCssVar("--foreground")})`;
    const gridColor = `hsl(${getCssVar("--border")})`;
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: textColor },
          grid: { display: false },
        },
        y: {
          ticks: { color: textColor },
          grid: { color: gridColor },
          beginAtZero: true,
        },
      },
    };
  }, [resolvedTheme]);

  return (
    <div className="w-full h-64">
      <Bar data={data} options={options} />
    </div>
  );
}
