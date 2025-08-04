import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import AppRouter from './router';
import ErrorBoundary from '@components/ErrorBoundary';
import { ThemeProvider } from '@components/ui/theme-provider';
import { ToastProvider } from '@components/ToastProvider';
import { Toaster } from '@components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthProvider';
import { NotificationsProvider } from '@/context/NotificationsProvider';

const queryClient = new QueryClient();
registerSW();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ToastProvider>
            <NotificationsProvider>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>
              <Toaster />
            </NotificationsProvider>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
