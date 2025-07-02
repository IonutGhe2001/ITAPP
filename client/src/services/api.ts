
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// 👉 Atașăm tokenul automat la fiecare request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Delogare doar pe 401 — nu pe 429
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    const isLoginRequest = requestUrl.includes("/auth/login") || requestUrl.includes("/auth");

    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // 429 — prea multe cereri → tratăm în componentă, nu delogăm
    return Promise.reject(error);
  }
);

export default api;
