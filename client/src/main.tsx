import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ThemeProvider } from "@components/ui/theme-provider";
import { ToastProvider } from "@components/ToastProvider";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ToastProvider />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
