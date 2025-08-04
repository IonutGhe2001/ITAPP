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
        'bg-card border-border rounded-2xl border shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg',
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
    </motion.section>
  );
}

export default memo(DashboardSectionCard);
