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
        'bg-card border-border rounded-2xl border shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg animate-fade-in-up',
        className
      )}
    >
      {(title || icon) && (
        <div className="text-foreground flex items-center gap-2 p-6 pb-0 text-xl font-semibold">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </div>
      )}
      <div className="flex h-full flex-col overflow-hidden p-6 pt-4">{children}</div>
    </section>
  );
}

export default memo(DashboardSectionCard);
