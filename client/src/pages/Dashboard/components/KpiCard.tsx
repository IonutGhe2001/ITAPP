import type { MouseEventHandler } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  delta: number;
  trend: 'up' | 'down';
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function KpiCard({ title, value, delta, trend, onClick }: KpiCardProps) {
  const Icon = trend === 'up' ? ArrowUpRight : ArrowDownRight;
  const deltaLabel = `${trend === 'down' ? '−' : '+'}${Math.abs(delta).toFixed(1)}%`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex h-full flex-col justify-between rounded-xl border border-border bg-card px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
        'shadow-none hover:border-primary/40 hover:bg-accent/30',
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {deltaLabel}
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{value}</p>
    </button>
  );
}