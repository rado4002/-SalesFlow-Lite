// src/services/inventoryAPI.ts
import { javaApi } from "./api/javaApi";

export const inventoryAPI = {
  getAll: () => javaApi.get("/inventory"),
  getById: (id: number) => javaApi.get(`/inventory/${id}`),
  create: (data: any) => javaApi.post("/inventory", data),
  update: (id: number, data: any) => javaApi.put(`/inventory/${id}`, data),
  delete: (id: number) => javaApi.delete(`/inventory/${id}`),
};
