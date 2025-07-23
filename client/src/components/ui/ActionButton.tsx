import { memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  variant?: "default" | "accent" | "muted";
};

function ActionButton({
  icon,
  label,
  onClick,
  className = "",
  variant = "default",
}: ActionButtonProps) {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    accent: "bg-accent text-accent-foreground hover:bg-accent/80",
    muted: "bg-muted text-muted-foreground hover:bg-muted/70",
 } as const;
  const variantClass = useMemo(() => variantStyles[variant], [variant]);

  return (
    <Button
      onClick={onClick}
      className={cn(
        "rounded-full px-6 py-4 flex items-center gap-3 shadow-md text-base font-semibold transition-all duration-200",
       variantClass,
        className
      )}
    >
      {icon}
      {label}
    </Button>
  );
}

export default memo(ActionButton);