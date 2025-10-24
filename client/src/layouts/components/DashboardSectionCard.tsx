import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type DashboardSectionCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
};

function DashboardSectionCard({ children, className, title, icon }: DashboardSectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'group relative overflow-hidden rounded-[28px] border border-border/60 bg-background/80 shadow-lg shadow-primary/5 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl',
        "before:absolute before:inset-x-0 before:-top-32 before:h-40 before:bg-gradient-to-b before:from-primary/20 before:via-transparent before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100",
        className
      )}
    >
      {(title || icon) && (
        <div className="relative flex items-center gap-3 px-6 pt-6 text-lg font-semibold text-foreground">
          {icon && <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</span>}
          <span>{title}</span>
        </div>
      )}
      <div className="relative flex h-full flex-col overflow-hidden p-6 pt-4">{children}</div>
    </motion.section>
  );
}

export default memo(DashboardSectionCard);
