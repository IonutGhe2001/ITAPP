import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { registerSW } from 'virtual:pwa-register';
import './index.css';
import './i18n/config';
import AppRouter from './router';
import ErrorBoundary from '@components/ErrorBoundary';
import { ThemeProvider } from '@components/ui/theme-provider';
import { Toaster } from '@components/ui/toaster';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Providers } from '@/context/Providers';
import { getToken, setToken } from '@/utils/storage';
import { resolveApiBaseUrl } from '@/utils/apiBaseUrl';

// 1) ia tokenul din hash și persistă-l
const params = new URLSearchParams(location.hash.replace(/^#/, ''));
const tokenFromHash = params.get('token');
if (tokenFromHash) {
  setToken(tokenFromHash);
  history.replaceState(null, '', location.pathname + location.search);
}

// 2) axios base + Bearer via AxiosHeaders; fără cookie-uri
axios.defaults.baseURL = resolveApiBaseUrl(); // ex: https://<API>/api
axios.defaults.withCredentials = false;

axios.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const tk = getToken();
  const headers = new AxiosHeaders(cfg.headers);   // normalizează tipul
  if (tk) headers.set('Authorization', `Bearer ${tk}`);
  cfg.headers = headers;
  return cfg;
});

const queryClient = new QueryClient();
registerSW();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Providers>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
          <Toaster />
          <ToastContainer />
        </ThemeProvider>
      </Providers>
    </QueryClientProvider>
  </StrictMode>
);
