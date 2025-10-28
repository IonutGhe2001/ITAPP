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
import type { EquipmentStatusSummary } from '../api';

interface EquipmentStatusChartProps {
  data: EquipmentStatusSummary[];
}

const colors = {
  online: '#22c55e',
  maintenance: '#f97316',
  offline: '#ef4444',
};

const tooltipLabels: Record<'online' | 'maintenance' | 'offline', string> = {
  online: 'Funcționale',
  maintenance: 'În mentenanță',
  offline: 'Offline',
};

const renderTooltip = ({
  active,
  payload,
}: TooltipProps<number, string> & { payload?: ReadonlyArray<Payload<number, string>> }) => {
  if (!active || !payload?.length) return null;
  const typedPayload = payload as ReadonlyArray<Payload<number, string>>;
  const category = (typedPayload[0].payload as EquipmentStatusSummary).category;

  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm">
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
        <BarChart data={chartData} barGap={8} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip cursor={{ fill: 'hsl(var(--muted) / 0.4)' }} content={renderTooltip} />
          <Legend
            verticalAlign="top"
            align="right"
            formatter={(value: string) => tooltipLabels[value as keyof typeof tooltipLabels] ?? value}
          />
          <Bar dataKey="online" stackId="status" name="Funcționale" fill={colors.online} radius={[4, 4, 0, 0]} />
          <Bar dataKey="maintenance" stackId="status" name="În mentenanță" fill={colors.maintenance} radius={[4, 4, 0, 0]} />
          <Bar dataKey="offline" stackId="status" name="Offline" fill={colors.offline} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}