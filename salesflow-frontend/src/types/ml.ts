export type AnalyticsPeriod = "daily" | "weekly" | "monthly";

export interface ForecastRequest {
  product_id?: number | null;
  history_days: number;
  forecast_days: number;
  period: AnalyticsPeriod;
}

export interface ForecastSummary {
  total: number;
  daily_average: number;
  peak_value: number;
  peak_day: string | null;
  trend: "upward" | "downward" | "stable";
  period_label: string | null;
}

export interface ForecastResult {
  product_id: number | null;
  dates: string[];
  predictions: number[];
  summary: ForecastSummary;
}

export interface AnomalyRequest {
  product_id?: number | null;
  history_days: number;
  period: AnalyticsPeriod;
}

export interface AnomalyResult {
  date: string;
  value: number;
  score: number;
  severity: "high" | "medium";
  type: "HIGH_SPIKE" | "ZERO_DROP" | "VARIANCE_SHIFT";
  explanation: string;
}

export interface AnomalyResponse {
  product_id: number | null;
  period: AnalyticsPeriod;
  count: number;
  anomalies: AnomalyResult[];
}

export type TabType = "forecast" | "anomalies";

export interface MLFormState {
  product_id: string;
  history_days: number;
  forecast_days: number;
  period: AnalyticsPeriod;
}
