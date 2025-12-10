// src/services/api/pythonApi.ts
import http from "./http";

export const PYTHON_API_URL = "http://127.0.0.1:8081/api/v1";

export const pythonApi = {
  get: (path: string, config: object = {}) =>
    http.get(`${PYTHON_API_URL}${path}`, config),

  post: (path: string, data: any, config: object = {}) =>
    http.post(`${PYTHON_API_URL}${path}`, data, config),

  put: (path: string, data: any, config: object = {}) =>
    http.put(`${PYTHON_API_URL}${path}`, data, config),

  delete: (path: string, config: object = {}) =>
    http.delete(`${PYTHON_API_URL}${path}`, config),
};
