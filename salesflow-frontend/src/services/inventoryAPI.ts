// src/services/inventoryAPI.ts
import { javaApi } from "./api/javaApi";

// Types pour plus de clarté
interface AddStockPayload {
  quantity: number;
  cost?: number;
}

interface UpdateStockPayload {
  quantity: number;
  cost: number;
}

export const inventoryAPI = {
  // GET ALL INVENTORY
  getAll: () => javaApi.get("/inventory"),

  // GET BY ID (optionnel, si tu l'ajoutes plus tard)
  getById: (id: number) => javaApi.get(`/inventory/${id}`),

  // GET BY SKU
  getBySku: (sku: string) => javaApi.get(`/inventory/by-sku/${sku}`),

  // GET BY NAME
  getByName: (name: string) => javaApi.get(`/inventory/by-name/${name}`),

  // CREATE / ADD STOCK (POST /inventory)
  create: (sku:string, data: AddStockPayload) => javaApi.patch(`/inventory/adjust/by-sku/${sku}`, data),

  // UPDATE BY SKU → CHANGÉ EN POST (ton backend ne supporte pas PUT)
  updateBySku: (sku: string, data: UpdateStockPayload) =>
    javaApi.patch(`/inventory/adjust/by-sku/${sku}`, data),

  // UPDATE BY NAME → aussi en POST si besoin
  updateByName: (name: string, data: UpdateStockPayload) =>
    javaApi.post(`/inventory/by-name/${name}`, data),

  // DELETE BY SKU
  deleteBySku: (sku: string) => javaApi.delete(`/inventory/by-sku/${sku}`),
};