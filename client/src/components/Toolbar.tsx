import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export default function Toolbar({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'backdrop-blur supports-[backdrop-filter]:bg-white/80 supports-[backdrop-filter]:dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 bg-white/90 dark:bg-slate-950/80 rounded-2xl p-4 md:p-5 shadow-sm transition-colors',
        'focus-within:ring-2 focus-within:ring-primary/40 focus-within:ring-offset-2 focus-within:ring-offset-transparent',
        'flex flex-col gap-4 lg:flex-row lg:flex-wrap',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}