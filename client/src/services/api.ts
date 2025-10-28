import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';
import { ROUTES } from '@/constants/routes';
import { getToken } from '@/utils/storage';
import { resolveApiBaseUrl } from '@/utils/apiBaseUrl';

const apiBaseUrl = resolveApiBaseUrl();

const api = axios.create({
  baseURL: apiBaseUrl,   // ex: https://preliminary-find-basin-janet.trycloudflare.com/api
  withCredentials: false, // fără cookie-uri
});

// === Auth Bearer interceptor ===
api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const tk = getToken();
  const headers = new AxiosHeaders(cfg.headers);
  if (tk) headers.set('Authorization', `Bearer ${tk}`);
  cfg.headers = headers;
  return cfg;
});

// === Global error handling ===
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl = error?.config?.url || '';

    // Nu face redirect automat dacă cererea e către /auth/me — lasă UI-ul să decidă
    const isAuthCheck = reqUrl.includes('/auth/me');
    const isLoginReq = reqUrl.includes('/auth/login');

    if (status === 401 && !isAuthCheck && !isLoginReq) {
      console.warn('Token expirat sau invalid. Redirecționez la login...');
      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);

export { apiBaseUrl };
export default api;
