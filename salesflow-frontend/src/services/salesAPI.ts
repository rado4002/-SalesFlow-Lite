// src/services/salesAPI.ts
import { javaApi } from "./api/javaApi";

// ------------------------------
// SALES API WRAPPER
// ------------------------------
export const salesAPI = {
  // GET /sales → all sales
  getAllSales: () => javaApi.get("/sales"),

  // POST /sales → create a single sale
  createSale: (data: any) => javaApi.post("/sales", data),

  // POST /sales/bulk → import multiple sales
  createBulkSales: (data: any[]) => javaApi.post("/sales/bulk", data),

  // GET /sales/today
  getSalesToday: () => javaApi.get("/sales/today"),

  // GET /sales/recent
  getRecentSales: () => javaApi.get("/sales/recent"),

  // GET /sales/history
  getSalesHistory: () => javaApi.get("/sales/history"),

  // GET /sales/history/{productId}
  getSalesHistoryByProduct: (productId: number) =>
    javaApi.get(`/sales/history/${productId}`),
};
