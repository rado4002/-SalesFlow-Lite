// src/services/mlAPI.ts

import { pythonApi } from "./api/pythonApi";
import type {
  ForecastRequest,
  ForecastResult,
  AnomalyRequest,
  AnomalyResponse,
} from "../types/ml";

/**
 * ML API
 *
 * RÈGLES (IMPORTANT) :
 * - Le backend attend un body WRAPPÉ :
 *   {
 *     payload: <DTO>,
 *     required_roles: []
 *   }
 * - swagger_auth se base sur cette structure
 * - Le frontend NE DOIT PAS envoyer le payload brut
 */
export const mlAPI = {
  // --------------------------------------------------
  // FORECAST (GLOBAL ou PRODUCT)
  // --------------------------------------------------
  forecastSales: async (
    payload: ForecastRequest
  ): Promise<ForecastResult> => {
    const wrappedBody = {
      payload,
      required_roles: [],
    };

    // Debug volontaire (dev only)
    console.log("📦 ML FORECAST REQUEST →", wrappedBody);

    const { data } = await pythonApi.post(
      "/ml/forecast",
      wrappedBody
    );

    return data;
  },

  // --------------------------------------------------
  // ANOMALY DETECTION (GLOBAL ou PRODUCT)
  // --------------------------------------------------
  detectAnomalies: async (
    payload: AnomalyRequest
  ): Promise<AnomalyResponse> => {
    const wrappedBody = {
      payload,
      required_roles: [],
    };

    // Debug volontaire (dev only)
    console.log("📦 ML ANOMALIES REQUEST →", wrappedBody);

    const { data } = await pythonApi.post(
      "/ml/anomalies",
      wrappedBody
    );

    return data;
  },
};
