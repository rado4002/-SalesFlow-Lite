// src/services/api/javaApi.ts
import http from "./http";

export const JAVA_API_URL = "http://10.131.221.179:8080/api/v1";

export const javaApi = {
  get: (path: string, config: object = {}) =>
    http.get(`${JAVA_API_URL}${path}`, config),

  post: (path: string, data: any, config: object = {}) =>
    http.post(`${JAVA_API_URL}${path}`, data, config),

  put: (path: string, data: any, config: object = {}) =>
    http.put(`${JAVA_API_URL}${path}`, data, config),

  delete: (path: string, config: object = {}) =>
    http.delete(`${JAVA_API_URL}${path}`, config),

  patch: (path: string, data: any, config: object = {}) =>
    http.patch(`${JAVA_API_URL}${path}`, data, config),
};

// ------------------------------------
// AUTH API (basé sur même logique)
// ------------------------------------
export const authAPI = {
  login: (credentials: any) =>
    http.post(`${JAVA_API_URL}/auth/login`, credentials).then((r) => r.data),

  me: () =>
    http.get(`${JAVA_API_URL}/auth/me`).then((r) => r.data),

  register: (data: any) =>
    http.post(`${JAVA_API_URL}/auth/register`, data).then((r) => r.data),

  logout: () =>
    http.post(`${JAVA_API_URL}/auth/logout`).then((r) => r.data),

  refresh: (refreshToken: string) =>
    http
      .post(`${JAVA_API_URL}/auth/refresh`, { refreshToken })
      .then((r) => r.data),
};
