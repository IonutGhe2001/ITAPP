import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from 'recharts';
import type { Payload } from 'recharts/types/component/DefaultTooltipContent';
import type { EquipmentStatusRecord } from '../api';

interface EquipmentStatusChartProps {
  data: EquipmentStatusRecord[];
}

const colors = {
  in_stock: '#0ea5e9',
  allocated: '#22c55e',
  repair: '#f97316',
  retired: '#64748b',
};

const tooltipLabels: Record<keyof typeof colors, string> = {
  in_stock: 'În stoc',
  allocated: 'Alocate',
  repair: 'În mentenanță',
  retired: 'Retrase',
};

const renderTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: ReadonlyArray<Payload<number, string>> }) => {
  if (!active || !payload?.length) return null;
  const typedPayload = payload as ReadonlyArray<Payload<number, string>>;
  const category = (typedPayload[0].payload as EquipmentStatusRecord).status;

  return (
    <div className="border-border bg-background rounded-lg border px-3 py-2 text-sm shadow-sm">
      <div className="font-semibold">{category}</div>
      <ul className="mt-2 space-y-1">
        {typedPayload.map((item) => {
          const key = item.dataKey as keyof typeof tooltipLabels | undefined;
          if (!key) return null;
          const value = typeof item.value === 'number' ? item.value : Number(item.value ?? 0);
          return (
            <li key={key} className="flex items-center justify-between gap-4">
              <span>{tooltipLabels[key]}</span>
              <span className="font-medium">{value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default function EquipmentStatusChart({ data }: EquipmentStatusChartProps) {
  const chartData = useMemo(() => data, [data]);

  return (
    <div className="h-[320px]" role="img" aria-label="Stare echipamente pe categorii">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barGap={10} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="status"
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} content={renderTooltip} />
          <Legend
            verticalAlign="bottom"
            align="center"
            formatter={(value: string) =>
              tooltipLabels[value as keyof typeof tooltipLabels] ?? value
            }
            wrapperStyle={{ paddingTop: 16 }}
          />
          <Bar
            dataKey="allocated"
            stackId="status"
            name="Alocate"
            fill={colors.allocated}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="in_stock"
            stackId="status"
            name="În stoc"
            fill={colors.in_stock}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="repair"
            stackId="status"
            name="În mentenanță"
            fill={colors.repair}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="retired"
            stackId="status"
            name="Retrase"
            fill={colors.retired}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}