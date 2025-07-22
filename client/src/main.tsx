import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@components/ui/theme-provider";
import { ToastProvider } from "@components/ToastProvider";
import { Toaster } from "@components/ui/toaster";
import { RefreshProvider } from "@/context/useRefreshContext"; 
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <ToastProvider>
          <RefreshProvider>
            <App />
            <Toaster />
          </RefreshProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
