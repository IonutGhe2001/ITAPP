import axios from 'axios';
import { getToken } from '@/utils/storage';
import { ROUTES } from '@/constants/routes';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  if (import.meta.env.DEV) {
    // Allow running without explicit API URL in development
    console.warn('VITE_API_URL is not defined. Falling back to "/api"');
  } else {
    throw new Error('VITE_API_URL is not defined');
  }
}

const api = axios.create({
  baseURL: apiUrl || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Delogare doar pe 401 — nu pe 429
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || '';

    const isLoginRequest = requestUrl.includes('/auth/login') || requestUrl.includes('/auth');

    if (status === 401 && !isLoginRequest) {
      window.location.href = ROUTES.LOGIN;
    }

    // 429 — prea multe cereri → tratăm în componentă, nu delogăm
    return Promise.reject(error);
  }
);

export default api;
