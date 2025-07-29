import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type DashboardSectionCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode; 
};

function DashboardSectionCard({
  children,
  className,
  title,
  icon,
}: DashboardSectionCardProps) {
  return (
   <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "rounded-2xl bg-card shadow-md border border-border transition-transform hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {(title || icon) && (
        <div className="p-6 pb-0 flex items-center gap-2 text-xl font-semibold text-foreground">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </div>
      )}
      <div className="p-6 pt-4 h-full flex flex-col overflow-hidden">{children}</div>
    </motion.section>
  );
}

export default memo(DashboardSectionCard);
