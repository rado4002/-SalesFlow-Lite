// src/services/mlAPI.ts

import { pythonApi } from "./api/pythonApi";
import type {
  ForecastRequest,
  ForecastResult,
  AnomalyRequest,
  AnomalyResponse,
} from "../types/ml";

export const mlAPI = {
  forecastSales: async (payload: ForecastRequest): Promise<ForecastResult> => {
    const wrapped = {
      payload,
      required_roles: [],
    };

    console.log("📦 WRAPPED FORECAST PAYLOAD =", wrapped);

    const { data } = await pythonApi.post("/ml/forecast", wrapped);
    return data;
  },

  detectAnomalies: async (payload: AnomalyRequest): Promise<AnomalyResponse> => {
    const wrapped = {
      payload,
      required_roles: [],
    };

    console.log("📦 WRAPPED ANOMALY PAYLOAD =", wrapped);

    const { data } = await pythonApi.post("/ml/anomalies", wrapped);
    return data;
  },
};
