// =============================================
// src/api/http.js — FINAL VERSION (JAVA-COMPATIBLE)
// =============================================

import axios from "axios";

// -------------------------------------------------
// Base URL: VITE PROXY handles `/api`
// -------------------------------------------------
const api = axios.create({
  baseURL: "/", // MUST stay "/" → Vite proxies /api/v1/auth
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // We use Bearer tokens, NOT cookies
});

// -------------------------------------------------
// TOKEN HELPERS
// -------------------------------------------------
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
};

// -------------------------------------------------
// REQUEST INTERCEPTOR — ADD BEARER
// -------------------------------------------------
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// -------------------------------------------------
// RESPONSE INTERCEPTOR — AUTO REFRESH + QUEUE
// -------------------------------------------------
let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error, newToken = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(newToken);
  });
  refreshQueue = [];
};

api.interceptors.response.use(
  (res) => res,

  async (err) => {
    const original = err.config;

    // If no original request → propagate error
    if (!original || original._retry) {
      const msg = err.response?.data?.message || err.message || "Request error";
      return Promise.reject(new Error(msg));
    }

    // ------------------------------------------
    // ⚠️ HANDLE 401 → TRY REFRESH
    // ------------------------------------------
    if (err.response?.status === 401) {
      original._retry = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(new Error("Missing refresh token"));
      }

      // App is already refreshing → queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newAccessToken) => {
            original.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(original);
          })
          .catch((e) => Promise.reject(e));
      }

      // Start refresh token call
      isRefreshing = true;

      try {
        const resp = await axios.post("/api/v1/auth/refresh", { refreshToken });
        const data = resp.data || {};

        const newAccess = data.accessToken;
        const newRefresh = data.refreshToken;

        if (!newAccess) throw new Error("Invalid refresh response");

        // Save tokens
        setTokens({ accessToken: newAccess, refreshToken: newRefresh });

        // Update API headers
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        // Retry original request
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);

      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearTokens();
        window.location.href = "/login?session=expired";
        return Promise.reject(refreshErr);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(
      new Error(err.response?.data?.message || "Request failed")
    );
  }
);

export default api;
