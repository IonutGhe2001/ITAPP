import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}