// src/services/api/http.ts
import axios from "axios";

/**
 * Axios HTTP client used by the frontend.
 * The frontend is environment-agnostic and consumes APIs as a client.
 */

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
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================================
// INTERCEPTOR — GLOBAL ERROR HANDLING
// ============================================
http.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    // Retry once on timeout
    if (error.code === "ECONNABORTED" && !error.config._retry) {
      error.config._retry = true;
      return http.request(error.config);
    }

    // Unauthorized → logout + redirect
    if (status === 401) {
      console.warn("Session expired — redirecting to login");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default http;
