// src/types/analytics.ts

// ============================================================
// SHARED
// ============================================================
export type AnalyticsPeriod = "daily" | "weekly" | "monthly" | "quarterly";

// ============================================================
// SALES ANALYTICS
// ============================================================
export interface DailySalesPoint {
  date: string;                    // ISO date: "2025-12-13"
  total_revenue: number;
  total_quantity: number;
  total_transactions: number;
}

export interface TopProductSales {
  product_id: number;
  name: string;
  total_quantity: number;
  revenue: number;
  share_of_revenue: number;        // %
}

export interface SalesKPI {
  total_revenue: number;
  total_quantity: number;
  total_transactions: number;
  average_ticket: number;
  top_products: TopProductSales[];
  seasonal_hint?: string | null;
}

export interface SalesAnalyticsResponse {
  period: AnalyticsPeriod;
  period_label: string;
  start_date: string;              // ISO date
  end_date: string;                // ISO date
  kpis: SalesKPI;
  daily: DailySalesPoint[];
}

// ============================================================
// STOCK ANALYTICS
// ============================================================
export type ProductStockStatus =
  | "OK"
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "DEAD_STOCK";

export interface StockKPI {
  total_stock_value: number;
  out_of_stock_count: number;
  low_stock_count: number;
  low_stock_ratio: number;
  urgent_reorder_count: number;
  dead_stock_count: number;
  rotation_per_year: number | null;
  avg_coverage_days: number | null;
}

export interface ProductStockSnapshot {
  product_id: number;
  name: string;
  current_stock: number;
  min_stock: number;
  unit_price: number;
  stock_value: number;
  status: ProductStockStatus;

  last_sale_date?: string | null;  // ISO date or null
  coverage_days?: number | null;
}

export interface StockAnalyticsResponse {
  period: AnalyticsPeriod;
  period_label: string;
  as_of: string;                   // ISO date
  kpis: StockKPI;
  critical_products: ProductStockSnapshot[];
}
