"use client";

import type { ReactNode } from "react";
import { ToastProvider as InternalToastProvider } from "@/hooks/use-toast/use-toast-hook";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <InternalToastProvider>{children}</InternalToastProvider>;
}
