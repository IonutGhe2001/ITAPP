import { cn } from "@/lib/utils";

type DashboardSectionCardProps = {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode; 
};

export default function DashboardSectionCard({
  children,
  className,
  title,
  icon,
}: DashboardSectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white p-6 shadow-md border border-border transition-transform hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      {(title || icon) && (
        <div className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
          {icon && <span className="text-2xl">{icon}</span>}
          {title}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}
