"use client";

import { useMemo, useCallback } from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useTheme } from "@components/ui/theme-provider-utils";
import { useNavigate } from "react-router-dom";
import { useOverviewStats } from "@/services/statsService";
import {
  EQUIPMENT_STATUS,
  EQUIPMENT_STATUS_LABELS,
} from "@/features/equipment/types";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

const getCssVar = (name: string) =>
  typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : "";

export default function OverviewCards() {
const navigate = useNavigate();
  const { data: stats } = useOverviewStats();

const angajatiCount = stats?.angajati ?? 0;
  const total = stats?.echipamente ?? 0;
  const inStoc = stats?.[EQUIPMENT_STATUS.IN_STOC] ?? 0;
  const alocate = stats?.[EQUIPMENT_STATUS.ALOCAT] ?? 0;
  const { resolvedTheme } = useTheme();

  const handleBarClick = useCallback<NonNullable<ChartOptions<"bar">["onClick"]>>(
    (_event, elements) => {
      if (!elements.length) return;
      const index = elements[0].index;
      if (index === 0) navigate("/colegi");
      else navigate("/echipamente");
    },
    [navigate]
  );

  const chartData = useMemo(
    () => {
      void resolvedTheme;
      return {
     labels: [
          "Angajați",
          "Echipamente",
          EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.IN_STOC],
          EQUIPMENT_STATUS_LABELS[EQUIPMENT_STATUS.ALOCAT],
        ],
        datasets: [
          {
            label: "Număr",
            data: [angajatiCount, total, inStoc, alocate],
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
    [angajatiCount, total, inStoc, alocate, resolvedTheme]
  );

  const options = useMemo<ChartOptions<"bar">>(() => {
    void resolvedTheme;
    const textColor = `hsl(${getCssVar("--foreground")})`;
    const gridColor = `hsl(${getCssVar("--border")})`;
    return {
      responsive: true,
      maintainAspectRatio: false,
      onClick: handleBarClick,
      plugins: {
        legend: { display: false },
        datalabels: {
          color: textColor,
          anchor: "end",
          align: "top",
          font: { weight: "bold" },
        },
      },
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
  }, [resolvedTheme, handleBarClick]);

  return (
     <div className="w-full h-64 sm:h-72 md:h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
}
