import axios from "axios";
import type { LoginCredentials, AuthResponse, User } from "../types/auth";

export const JAVA_API_URL = "http://localhost:8080/api/v1";
export const PYTHON_API_URL = "http://localhost:8081";

const devMode = import.meta.env.VITE_ENV === "dev";

// --------------------------------------
// AXIOS INSTANCE
// --------------------------------------
export const api = axios.create({
  timeout: 15000,
});

// --------------------------------------
// JWT ATTACH
// --------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).set
      ? config.headers.set("Authorization", `Bearer ${token}`)
      : (config.headers["Authorization"] = `Bearer ${token}`);
  }

  return config;
});

// --------------------------------------
// GLOBAL ERROR HANDLING
// --------------------------------------
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (devMode) {
      console.warn("DEV MODE: ignoring auth error:", status);
      return Promise.reject(err);
    }

    if (status === 401) {
      console.warn("❌ Token expired — logout");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

// --------------------------------------
// JAVA API WRAPPER
// --------------------------------------
export const javaApi = {
  get: (path: string, config = {}) =>
    api.get(`${JAVA_API_URL}${path}`, config),

  post: (path: string, data: any, config = {}) =>
    api.post(`${JAVA_API_URL}${path}`, data, config),
};

// --------------------------------------
// PYTHON API WRAPPER
// --------------------------------------
export const pythonApi = {
  get: (path: string, config = {}) =>
    api.get(`${PYTHON_API_URL}${path}`, config),

  // ✅ POST ajouté pour Excel Upload, Commit, ML Forecast
  post: (path: string, data: any, config = {}) =>
    api.post(`${PYTHON_API_URL}${path}`, data, config),
};

// --------------------------------------
// AUTH API (JAVA)
// --------------------------------------
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post(`${JAVA_API_URL}/auth/login`, credentials);
    return response.data;
  },

  verifyToken: async (token: string): Promise<User> => {
    const response = await api.get(`${JAVA_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
