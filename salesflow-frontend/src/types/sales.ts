// =========================================================
// SALES TYPES — EXACT MATCH WITH JAVA DTOs
// Source of truth: backend Java (SaleResponse / SaleItemResponse)
// =========================================================


// ---------------------------------------------------------
// 1) SALE ITEM — Java: SaleItemResponse
// ---------------------------------------------------------
export interface SaleItem {
  productId: number;     // long
  productName: string;   // String
  sku: string;           // String
  quantity: number;      // int
  unitPrice: number;     // double
  subtotal: number;      // double (quantity * unitPrice)
}


// ---------------------------------------------------------
// 2) SALE — Java: SaleResponse / api/v1/sales/history
// ---------------------------------------------------------
export interface Sale {
  id: number;            // long
  saleDate: string;      // ISO date-time (ex: 2025-12-12T10:03:54.132Z)
  totalAmount: number;   // double
  items: SaleItem[];
}


// ---------------------------------------------------------
// 3) CREATE SALE — Java: CreateSaleRequest
// (USED FOR POST /api/v1/sales)
// ---------------------------------------------------------
export interface CreateSaleRequest {
  items: {
    productId: number;   // long (required)
    quantity: number;    // int (min = 1)
  }[];
}


// ---------------------------------------------------------
// 4) SALES HISTORY — Java: SalesHistoryDto
// (USED FOR /sales/history/by-sku | by-name)
// ---------------------------------------------------------
export interface SalesHistoryPoint {
  date: string;          // yyyy-MM-dd
  quantity: number;      // int
}
