// src/services/analyticsAPI.ts

import { pythonApi } from "./api/pythonApi";
import type {
  AnalyticsPeriod,
  SalesAnalyticsResponse,
  StockAnalyticsResponse
} from "../types/analytics";

export const analyticsAPI = {
  // --- Sales analytics (with optional date range)
  getSalesAnalytics: async (
    period: AnalyticsPeriod,
    start_date?: string,
    end_date?: string
  ) => {
    const res = await pythonApi.get("/analytics/sales", {
      params: { period, start_date, end_date }
    });

    return res.data as SalesAnalyticsResponse;
  },

  // --- Stock analytics
  getStockAnalytics: async (period: AnalyticsPeriod) => {
    const res = await pythonApi.get("/analytics/stock", {
      params: { period }
    });

    return res.data as StockAnalyticsResponse;
  },
};
