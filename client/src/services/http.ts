import type { AxiosRequestConfig } from 'axios';
import api from './api';

// Generic HTTP helper wrapping Axios instance
// Provides typed methods returning the response data directly
const http = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const res = await api.get<T>(url, config);
    return res.data;
  },
  post: async <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
    const res = await api.post<T>(url, data, config);
    return res.data;
  },
  put: async <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
    const res = await api.put<T>(url, data, config);
    return res.data;
  },
  patch: async <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => {
    const res = await api.patch<T>(url, data, config);
    return res.data;
  },
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig) => {
    const res = await api.delete<T>(url, config);
    return res.data;
  },
};

export default http;
