// src/services/productAPI.ts
import { javaApi } from "./api/javaApi";

export const productAPI = {
  getAll: () => javaApi.get("/products"),
  getById: (id: number) => javaApi.get(`/products/${id}`),
  create: (data: any) => javaApi.post("/products", data),
  update: (id: number, data: any) => javaApi.put(`/products/${id}`, data),
  delete: (id: number) => javaApi.delete(`/products/${id}`),
  getLowStock: () => javaApi.get("/products/low-stock"),
};
