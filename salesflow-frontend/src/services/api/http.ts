// src/services/api/http.ts
import axios from "axios";

const devMode = import.meta.env.VITE_ENV === "dev";

// ============================================
// AXIOS INSTANCE UNIQUE
// ============================================
const http = axios.create({
  timeout: 30000,
});

// ============================================
// INTERCEPTOR — JWT ATTACH
// ============================================
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const isAuthRoute =
    config.url?.includes("/auth/login") ||
    config.url?.includes("/auth/register") ||
    config.url?.includes("/auth/refresh");

  if (!isAuthRoute && token) {
    config.headers = config.headers || {};
    (config.headers as any)["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

// ============================================
// INTERCEPTOR — GLOBAL ERROR HANDLING
// ============================================
http.interceptors.response.use(
  (res) => res,

  async (err) => {
    const status = err.response?.status;

    if (devMode) {
      console.warn("DEV MODE — ignoring HTTP error:", status);
      return Promise.reject(err);
    }

    // Retry on timeout
    if (err.code === "ECONNABORTED" && !err.config._retry) {
      err.config._retry = true;
      return http.request(err.config);
    }

    // Token expiré → redirect login
    if (status === 401) {
      console.warn("Session expired — logging out");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default http;
