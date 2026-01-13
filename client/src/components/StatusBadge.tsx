import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type StatusBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneStyles: Record<StatusBadgeTone, string> = {
  neutral:
    'bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80',
  success:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-500/30',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 border border-amber-200/70 dark:border-amber-500/30',
  danger:
    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300 border border-red-200/70 dark:border-red-500/30',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200/70 dark:border-blue-500/30',
};

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  tone?: StatusBadgeTone;
  withDot?: boolean;
}

export default function StatusBadge({
  label,
  tone = 'neutral',
  withDot = false,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-tight shadow-sm transition-colors',
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className={cn(
            'h-1.5 w-1.5 rounded-full shadow',
            tone === 'success'
              ? 'bg-emerald-500'
              : tone === 'warning'
                ? 'bg-amber-500'
                : tone === 'danger'
                  ? 'bg-red-500'
                  : tone === 'info'
                    ? 'bg-blue-500'
                    : 'bg-slate-400'
          )}
        />
      )}
      <span className="whitespace-nowrap">{label}</span>
      {children}
    </span>
  );
}
