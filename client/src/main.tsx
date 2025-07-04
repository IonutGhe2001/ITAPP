import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@components/ui/theme-provider";
import { ToastProvider } from "@components/ToastProvider";
import { Toaster } from "@components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ToastProvider>
        <App />
        <Toaster />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
