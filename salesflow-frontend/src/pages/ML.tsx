import { useState } from "react";
import { mlAPI } from "../services/mlAPI";
import type {
  ForecastResult,
  AnomalyResponse,
  ForecastRequest,
  AnomalyRequest,
  AnalyticsPeriod,
} from "../types/ml";

export default function MLPage() {
  // Inputs utilisateur
  const [productId, setProductId] = useState<string>("1");
  const [historyDays, setHistoryDays] = useState(90);
  const [forecastDays, setForecastDays] = useState(7);
  const [period, setPeriod] = useState<AnalyticsPeriod>("daily");

  // Résultats
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyResponse | null>(null);

  // État du chargement & erreurs
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // FORECAST
  // ---------------------------------------------------------
  const handleForecast = async () => {
    setError(null);
    setForecast(null);
    setLoadingForecast(true);

    const pid = Number(productId);
    if (!pid || pid <= 0) {
      setError("Product ID must be a positive number.");
      setLoadingForecast(false);
      return;
    }

    const payload: ForecastRequest = {
      product_id: pid,
      history_days: historyDays,
      forecast_days: forecastDays,
      period,
    };

    try {
      const result = await mlAPI.forecastSales(payload);
      setForecast(result);
    } catch (err: any) {
      console.error("❌ Forecast error", err);
      const msg = err.response?.data?.detail || err.message;
      setError("Forecast failed : " + String(msg));
    } finally {
      setLoadingForecast(false);
    }
  };

  // ---------------------------------------------------------
  // ANOMALY DETECTION
  // ---------------------------------------------------------
  const handleAnomalies = async () => {
    setError(null);
    setAnomalies(null);
    setLoadingAnomalies(true);

    const pid = Number(productId);
    if (!pid || pid <= 0) {
      setError("Product ID must be a positive number.");
      setLoadingAnomalies(false);
      return;
    }

    const payload: AnomalyRequest = {
      product_id: pid,
      history_days: historyDays,
      period,
    };

    try {
      const result = await mlAPI.detectAnomalies(payload);
      setAnomalies(result);
    } catch (err: any) {
      console.error("❌ Anomaly error", err);
      const msg = err.response?.data?.detail || err.message;
      setError("Anomaly detection failed : " + String(msg));
    } finally {
      setLoadingAnomalies(false);
    }
  };

  // ---------------------------------------------------------
  // RENDERING
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <h1 className="text-4xl font-bold">Machine Learning</h1>

        {/* ======================= FORMULAIRE ML ======================= */}
        <div className="bg-white p-6 rounded-xl shadow space-y-6">
          <h2 className="text-2xl font-semibold">ML Parameters</h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <label className="font-medium">Product ID</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <div>
              <label className="font-medium">History Days</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                value={historyDays}
                onChange={(e) => setHistoryDays(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-medium">Forecast Days</label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded"
                value={forecastDays}
                onChange={(e) => setForecastDays(Number(e.target.value))}
              />
            </div>

            <div>
              <label className="font-medium">Period</label>
              <select
                className="w-full mt-1 p-2 border rounded"
                value={period}
                onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleForecast}
              disabled={loadingForecast}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loadingForecast ? "Forecasting..." : "Run Forecast"}
            </button>

            <button
              onClick={handleAnomalies}
              disabled={loadingAnomalies}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loadingAnomalies ? "Scanning..." : "Detect Anomalies"}
            </button>
          </div>
        </div>

        {/* ======================= ERROR ======================= */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* ======================= FORECAST RESULT ======================= */}
        {forecast && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">
              Forecast Results
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded">
                <p>Total</p>
                <p className="text-2xl font-bold">{forecast.summary.total}</p>
              </div>

              <div className="bg-green-50 p-4 rounded">
                <p>Daily Avg</p>
                <p className="text-2xl font-bold">
                  {forecast.summary.daily_average}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded">
                <p>Peak</p>
                <p className="text-2xl font-bold">
                  {forecast.summary.peak_value}
                </p>
                <p>{forecast.summary.peak_day}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded">
                <p>Trend</p>
                <p className="text-xl font-bold">{forecast.summary.trend}</p>
              </div>
            </div>

            <h3 className="font-semibold mb-3">Predictions</h3>
            <div className="max-h-64 overflow-auto space-y-2">
              {forecast.dates.map((date, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-gray-50 p-2 rounded"
                >
                  <span>{date}</span>
                  <span>{forecast.predictions[i]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= ANOMALIES RESULT ======================= */}
        {anomalies && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Anomalies ({anomalies.count})
            </h2>

            {anomalies.count === 0 ? (
              <p className="text-green-600 font-medium">
                No anomalies detected.
              </p>
            ) : (
              <div className="space-y-4">
                {anomalies.anomalies.map((a, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border-l-4 bg-red-50 border-red-500"
                  >
                    <p className="font-bold">{a.date}</p>
                    <p className="text-sm">
                      {a.type} — {a.severity.toUpperCase()}
                    </p>
                    <p>{a.explanation}</p>
                    <p className="text-xs text-gray-600">
                      Score Z: {a.score}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
