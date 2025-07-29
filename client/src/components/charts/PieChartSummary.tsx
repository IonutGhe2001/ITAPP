"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useTheme } from "@/components/ui/theme-provider-utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const getCssVar = (name: string) =>
  typeof window !== "undefined"
    ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    : "";

export interface PieChartItem {
  label: string;
  value: number;
}

interface PieChartSummaryProps {
  items: PieChartItem[];
  onSliceClick?: (item: PieChartItem) => void;
}

export default function PieChartSummary({ items, onSliceClick }: PieChartSummaryProps) {
  void useTheme();

  const data = {
    labels: items.map((i) => i.label),
    datasets: [
      {
        data: items.map((i) => i.value),
        backgroundColor: items.map((_, idx) => `hsl(${getCssVar(`--chart-${idx + 1}`)})`),
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (_event, elements) => {
      if (onSliceClick && elements.length) {
        const index = elements[0].index;
        onSliceClick(items[index]);
      }
    },
    plugins: { legend: { position: "bottom" } },
  };

  return <Pie data={data} options={options} />;
}