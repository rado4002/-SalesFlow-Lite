// src/services/productAPI.ts
import { javaApi } from "./api/javaApi";

export const productAPI = {
  // GET ALL PRODUCTS
  getAll: () => javaApi.get("/products"),

  // GET BY ID (principal – ton endpoint préféré)
  getById: (id: number) => javaApi.get(`/products/by-id/${id}`),

  // GET OPTIONNELS (par SKU ou Name)
  getBySku: (sku: string) => javaApi.get(`/products/by-sku/${sku}`),
  getByName: (name: string) => javaApi.get(`/products/by-name/${name}`),

  // GET LOW STOCK
  getLowStock: () => javaApi.get("/products/low-stock"),

  // CREATE
  create: (data: any) => javaApi.post("/products", data),

  // UPDATE – principal par ID + options par SKU/Name
  update: (id: number, data: any) => javaApi.put(`/products/by-id/${id}`, data),
  updateBySku: (sku: string, data: any) => javaApi.put(`/products/by-sku/${sku}`, data),
  updateByName: (name: string, data: any) => javaApi.put(`/products/by-name/${name}`, data),

  // DELETE – principal par ID + options par SKU/Name
  delete: (id: number) => javaApi.delete(`/products/by-id/${id}`),
  deleteBySku: (sku: string) => javaApi.delete(`/products/by-sku/${sku}`),
  deleteByName: (name: string) => javaApi.delete(`/products/by-name/${name}`),
};