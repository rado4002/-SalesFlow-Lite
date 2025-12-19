// src/services/salesAPI.ts
import { javaApi } from "./api/javaApi";
import type {
  Sale,
  CreateSaleRequest,
  SalesHistoryPoint,
} from "../types/sales";

// ------------------------------
// SALES API WRAPPER
// ------------------------------
export const salesAPI = {
  // ======================================================
  // BASIC SALES
  // ======================================================

  // GET /api/v1/sales → all sales
  getAllSales: async () => {
    const res = await javaApi.get("/sales");
    return res.data as Sale[];
  },

  // POST /api/v1/sales → create a single sale
  createSale: async (data: CreateSaleRequest) => {
    const res = await javaApi.post("/sales", data);
    return res.data;
  },

  // POST /api/v1/sales/bulk → import multiple sales
  createBulkSales: async (data: CreateSaleRequest[]) => {
    const res = await javaApi.post("/sales/bulk", data);
    return res.data;
  },

  // ======================================================
  // QUICK VIEWS
  // ======================================================

  // GET /api/v1/sales/today
  getSalesToday: async () => {
    const res = await javaApi.get("/sales/today");
    return res.data as Sale[];
  },

  // GET /api/v1/sales/recent
  getRecentSales: async () => {
    const res = await javaApi.get("/sales/recent");
    return res.data as Sale[];
  },

  // ======================================================
  // SALES HISTORY (GLOBAL)
  // Used for History / Analytics / ML
  // ======================================================

  // GET /api/v1/sales/history
  getSalesHistory: async () => {
    const res = await javaApi.get("/sales/history");
    return res.data as Sale[];
  },

  // GET /api/v1/sales/history/{productId}
  getSalesHistoryByProductId: async (productId: number) => {
    const res = await javaApi.get(`/sales/history/${productId}`);
    return res.data as Sale[];
  },

  // ======================================================
  // SALES HISTORY — SEARCH / FILTER ONLY
  // ======================================================

  // GET /api/v1/sales/history/by-sku/{sku}
  getSalesHistoryBySku: async (sku: string) => {
    const res = await javaApi.get(
      `/sales/history/by-sku/${encodeURIComponent(sku)}`
    );
    return res.data as SalesHistoryPoint[];
  },

  // GET /api/v1/sales/history/by-name/{name}
  getSalesHistoryByName: async (name: string) => {
    const res = await javaApi.get(
      `/sales/history/by-name/${encodeURIComponent(name)}`
    );
    return res.data as SalesHistoryPoint[];
  },
};
