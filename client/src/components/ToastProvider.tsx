"use client";

import type { ReactNode } from "react";
import { ToastProvider as InternalToastProvider } from "@/hooks/useToast";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <InternalToastProvider>{children}</InternalToastProvider>;
}
