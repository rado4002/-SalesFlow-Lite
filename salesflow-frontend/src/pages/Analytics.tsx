import { useState, useEffect } from "react";
import { analyticsAPI } from "../services/analyticsAPI";
import ReportsExport from "../components/analytics/ReportsExport";

import type {
  SalesAnalyticsResponse,
  StockAnalyticsResponse,
  AnalyticsPeriod,
} from "../types/analytics";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Analytics() {
  const [period, setPeriod] = useState<AnalyticsPeriod>("weekly");

  const [sales, setSales] = useState<SalesAnalyticsResponse | null>(null);
  const [stock, setStock] = useState<StockAnalyticsResponse | null>(null);

  const [loading, setLoading] = useState(true);

  // -------------------------------
  // LOAD ANALYTICS
  // -------------------------------
  const load = async () => {
    setLoading(true);
    try {
      const [s, st] = await Promise.all([
        analyticsAPI.getSalesAnalytics(period),
        analyticsAPI.getStockAnalytics(period),
      ]);

      setSales(s);
      setStock(st);
    } catch (e) {
      console.error("Analytics error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [period]);

  if (loading || !sales || !stock) {
    return (
      <div className="p-10 text-center text-gray-600 text-lg">
        Loading analytics…
      </div>
    );
  }

  const k = sales.kpis;

  return (
    <div className="p-6 space-y-10">

      {/* ---------------- PERIOD SELECT ---------------- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
          className="border rounded-lg p-2 shadow-sm"
        >
          <option value="daily">Today</option>
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">Last 90 Days</option>
        </select>
      </div>

      {/* ---------------- KPI CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <KPI title="Revenue" value={`$${k.total_revenue}`} />
        <KPI title="Transactions" value={k.total_transactions} />
        <KPI title="Units Sold" value={k.total_quantity} />
        <KPI title="Avg Ticket" value={`$${k.average_ticket}`} />

      </div>

      {/* ---------------- SALES TREND GRAPH ---------------- */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-bold mb-4">Daily Revenue Trend</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sales.daily}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---------------- TOP PRODUCTS ---------------- */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-bold mb-4">Top 5 Products</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-600">
              <th>Name</th>
              <th>Qty</th>
              <th>Revenue</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            {k.top_products.map((p) => (
              <tr key={p.product_id} className="border-b">
                <td>{p.name}</td>
                <td>{p.total_quantity}</td>
                <td>${p.revenue.toFixed(2)}</td>
                <td>{p.share_of_revenue.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- CRITICAL STOCK ---------------- */}
      <div className="bg-white shadow rounded-xl p-6 border">
        <h2 className="text-xl font-bold mb-4 text-red-600">
          Critical Stock Items
        </h2>

        {stock.critical_products.length === 0 ? (
          <p className="text-gray-500">No critical stock alerts.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th>Product</th>
                <th>Stock</th>
                <th>Min</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stock.critical_products.map((p) => (
                <tr key={p.productId} className="border-b">
                  <td>{p.name}</td>
                  <td>{p.current_stock}</td>
                  <td>{p.min_stock}</td>
                  <td className="text-red-600 font-bold">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ---------------- EXPORT PDF / EXCEL ---------------- */}
      <ReportsExport />
    </div>
  );
}


/* -------- SMALL COMPONENT -------- */
function KPI({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white shadow p-6 border rounded-xl">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
