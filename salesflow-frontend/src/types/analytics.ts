// src/types/analytics.ts

export type AnalyticsPeriod = "daily" | "weekly" | "monthly" | "quarterly";

export interface DailySalesPoint {
  date: string;
  total_revenue: number;
  total_quantity: number;
  total_transactions: number;
}

export interface TopProductSales {
  product_id: number;
  name: string;
  total_quantity: number;
  revenue: number;
  share_of_revenue: number;
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
  start_date: string;
  end_date: string;
  kpis: SalesKPI;
  daily: DailySalesPoint[];
}

export interface StockKPI {
  total_stock_value: number;
  out_of_stock_count: number;
  low_stock_count: number;
  low_stock_ratio: number;
  urgent_reorder_count: number;
  dead_stock_count: number;
  rotation_per_year: number;
  avg_coverage_days: number | null;
}

export interface ProductStockSnapshot {
  productId: number;
  name: string;
  current_stock: number;
  min_stock: number;
  status: string;
  last_sale_date?: string;
  coverage_days?: number;
  stock_value: number;
}

export interface StockAnalyticsResponse {
  period: AnalyticsPeriod;
  period_label: string;
  as_of: string;
  kpis: StockKPI;
  critical_products: ProductStockSnapshot[];
}
