import { useState } from "react";
import { pythonApi } from "../services/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types
interface ForecastSummary {
  total: number;
  daily_average: number;
  peak_value: number;
  peak_day: string | null;
}

interface ForecastResponse {
  product_id: number;
  dates: string[];
  predictions: number[];
  trend: "upward" | "downward" | "stable";
  summary: ForecastSummary;
}

export default function ML() {
  const [productId, setProductId] = useState<string>("1");
  const [days, setDays] = useState<string>("90");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------
  // FORECAST REQUEST
  // ---------------------------------------------------------
  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    setForecast(null);

    const pId = Number(productId.trim());
    const hDays = Number(days.trim());

    // Validation
    if (!productId || isNaN(pId) || pId <= 0) {
      setError("Product ID must be a valid positive number.");
      setLoading(false);
      return;
    }

    if (!days || isNaN(hDays) || hDays <= 0) {
      setError("History days must be a valid positive number.");
      setLoading(false);
      return;
    }

    // ✅ OPTION A — WRAPPED PAYLOAD (backend-compatible)
    const payload = {
      payload: {
        product_id: pId,
        history_days: hDays,
        forecast_days: 7,
      },
      required_roles: [],
    };

    console.log("🚀 ML PAYLOAD SENT =", payload);

    try {
      const response = await pythonApi.post("/ml/forecast", payload);
      console.log("✔ ML RESPONSE =", response.data);

      setForecast(response.data);
    } catch (err: any) {
      console.error("❌ Forecast error:", err);

      const detail = err?.response?.data?.detail || err?.message || "Error";
      setError(typeof detail === "string" ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // CHART DATA
  // ---------------------------------------------------------
  const chartData =
    forecast?.dates?.map((date, idx) => ({
      date,
      predicted: forecast.predictions[idx] ?? 0,
    })) || [];

  const getTrendColor = (trend: string) => {
    if (trend === "upward") return "text-green-600";
    if (trend === "downward") return "text-red-600";
    return "text-gray-600";
  };

  // ---------------------------------------------------------
  // RENDER UI
  // ---------------------------------------------------------
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Machine Learning</h1>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <h2 className="text-xl font-semibold">📈 Sales Forecast (7 days)</h2>

        {/* FORM */}
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm font-medium">Product ID</label>
            <input
              type="number"
              className="border p-2 rounded w-32"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">History (days)</label>
            <input
              type="number"
              className="border p-2 rounded w-32"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>

          <button
            onClick={fetchForecast}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Generate Forecast
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-blue-500 animate-pulse">Loading…</p>}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-200 text-red-800 rounded-xl break-all">
            {error}
          </div>
        )}

        {/* Forecast Result */}
        {forecast && (
          <div className="space-y-10">
            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Total (7 days)</p>
                <p className="text-2xl font-bold">{forecast.summary.total}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Daily Average</p>
                <p className="text-2xl font-bold">
                  {forecast.summary.daily_average}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Peak Value</p>
                <p className="text-2xl font-bold">
                  {forecast.summary.peak_value}
                </p>
                <p className="text-xs text-gray-500">
                  {forecast.summary.peak_day}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl shadow">
                <p className="text-sm text-gray-500">Trend</p>
                <p
                  className={`text-2xl font-bold ${getTrendColor(
                    forecast.trend
                  )}`}
                >
                  {forecast.trend.toUpperCase()}
                </p>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">
                Sales Forecast Graph
              </h3>

              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
