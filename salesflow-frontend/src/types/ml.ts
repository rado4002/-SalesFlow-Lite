// src/types/ml.ts
// ============================================================
// ML TYPES — ALIGNED WITH BACKEND (2025)
// ============================================================

export type AnalyticsPeriod = "daily" | "weekly" | "monthly";

// ============================================================
// FORECAST / ANOMALY SCOPE
// ============================================================
export type ForecastScope = "GLOBAL" | "PRODUCT";

// ============================================================
// PRODUCT INFO (UI enrichment)
// ============================================================
export interface ProductInfo {
  id?: number | null;
  sku?: string | null;
  name?: string | null;
  price?: number | null;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  // Ajoute d'autres champs si besoin
}

// ============================================================
// FORECAST REQUEST
// ============================================================
export interface ForecastRequest {
  scope: ForecastScope;

  /**
   * En mode PRODUCT : au moins l'un des deux doit être fourni
   */
  sku?: string | null;
  name?: string | null;

  /**
   * Optionnel — pour traçabilité / caching UI
   */
  product_id?: number | null;

  forecast_days: number;
  period: AnalyticsPeriod;
}

// ============================================================
// FORECAST SUMMARY
// ============================================================
export interface ForecastSummary {
  total: number;
  daily_average: number;
  peak_value: number;
  peak_day: string;
  trend: "upward" | "downward" | "stable";
  period_label: string;
}

// ============================================================
// FORECAST RESULT
// ============================================================
export interface ForecastResult {
  scope: ForecastScope;
  product_id: number | null;
  product_sku?: string | null;  // conservé si envoyé

  dates: string[];
  predictions: number[];

  summary: ForecastSummary;

  /**
   * Enrichissement UI complet (nom, prix, image, etc.)
   */
  product?: ProductInfo | null;
}

// ============================================================
// ANOMALY REQUEST
// ============================================================
export interface AnomalyRequest {
  scope: ForecastScope;

  sku?: string | null;
  name?: string | null;
  product_id?: number | null;

  period: AnalyticsPeriod;
}

// ============================================================
// ANOMALY RESULT
// ============================================================
export interface AnomalyResult {
  date: string;
  value: number;
  score: number;
  severity: "high" | "medium";
  type: "HIGH_SPIKE" | "DROP";
  explanation: string;
}

// ============================================================
// ANOMALY RESPONSE
// ============================================================
export interface AnomalyResponse {
  scope: ForecastScope;
  product_id: number | null;
  product_sku?: string | null;

  period: AnalyticsPeriod;
  count: number;
  anomalies: AnomalyResult[];

  product?: ProductInfo | null;
}

// ============================================================
// UI HELPERS
// ============================================================
export type TabType = "forecast" | "anomalies";

export interface MLFormState {
  scope: ForecastScope;
  searchQuery: string;         // pour l'autocomplete
  selectedProduct: ProductInfo | null;

  forecast_days: number;
  period: AnalyticsPeriod;
}