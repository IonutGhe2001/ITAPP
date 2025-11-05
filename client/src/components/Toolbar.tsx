import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Toolbar({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur transition-colors supports-[backdrop-filter]:bg-white/80 md:p-5 dark:border-slate-800/70 dark:bg-slate-950/80 supports-[backdrop-filter]:dark:bg-slate-900/80',
        'focus-within:ring-primary/40 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-transparent',
        'flex flex-col gap-4 lg:flex-row lg:flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
