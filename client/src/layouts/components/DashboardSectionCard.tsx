import { memo } from 'react';
import { cn } from '@/lib/utils';

type DashboardSectionCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
};

function DashboardSectionCard({ children, className, title, icon }: DashboardSectionCardProps) {
  return (
    <section
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/60 bg-background/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {(title || icon) && (
        <div className="flex items-center gap-3 px-6 pb-0 pt-6">
          {icon && (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {icon}
            </span>
          )}
          {title && <h2 className="text-foreground text-lg font-semibold">{title}</h2>}
        </div>
      )}
      <div className="flex h-full flex-col gap-4 p-6 pt-4">{children}</div>
    </section>
  );
}

export default memo(DashboardSectionCard);
