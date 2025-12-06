import { useEffect, useState } from "react";
import { pythonApi } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DailyPoint {
  date: string;
  total: number;
}

interface SalesTrendData {
  daily_totals: DailyPoint[];
  total_revenue: number;
  trend_direction: "up" | "down" | "stable";
  percent_change: number;
}

const Dashboard = () => {
  const [trend, setTrend] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgDailySales, setAvgDailySales] = useState(0);
  const [bestDay, setBestDay] = useState("");

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing JWT token. Please log in.");

      const start = "2025-01-01";
      const end = "2025-01-31";

      const res = await pythonApi.get(
  `/analytics/sales-trend?start_date=${start}&end_date=${end}`,
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);


      const analytics: SalesTrendData = res.data.analytics;

      setTrend(analytics.daily_totals);
      setTotalRevenue(analytics.total_revenue);

      if (analytics.daily_totals.length > 0) {
        setAvgDailySales(
          Math.round(analytics.total_revenue / analytics.daily_totals.length)
        );

        const maxSales = Math.max(...analytics.daily_totals.map((d) => d.total));
        const best = analytics.daily_totals.find((d) => d.total === maxSales);
        setBestDay(best ? best.date : "N/A");
      } else {
        setAvgDailySales(0);
        setBestDay("N/A");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-600">
        Loading dashboard...
      </div>
    );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Business performance overview</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            ${totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-sm text-gray-500">Average Daily Sales</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            ${avgDailySales.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <p className="text-sm text-gray-500">Best Performing Day</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{bestDay}</p>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(v) => `$${v}`} />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>  // <-- CLOSING ROOT DIV, IMPORTANT!
  );
};

export default Dashboard;
