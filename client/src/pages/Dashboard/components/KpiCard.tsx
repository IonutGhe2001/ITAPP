import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  delta: number;
  trend: 'up' | 'down' | 'neutral';
  href?: string;
}

export function KpiCard({ title, value, delta, trend, href }: KpiCardProps) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const deltaLabel = `${trend === 'down' ? '−' : trend === 'up' ? '+' : ''}${Math.abs(delta).toFixed(1)}%`;
  const baseClasses = cn(
    'group flex min-h-[128px] flex-col justify-between rounded-xl border border-border bg-card px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary',
    'shadow-none hover:border-primary/40 hover:bg-accent/30'
  );

  const content = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-sm font-medium">{title}</span>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            trend === 'up'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
              : trend === 'down'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300'
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {deltaLabel}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">{value}</p>
        <p className="text-muted-foreground text-xs">Față de ultimele 7 zile</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link to={href} role="link" className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={baseClasses}>
      {content}
    </button>
  );
}
