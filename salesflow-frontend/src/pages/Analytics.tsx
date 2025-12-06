import { useEffect, useState } from "react";
import { pythonApi } from "../services/api";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Helper to format dates YYYY-MM-DD
const formatDate = (d: Date) => d.toISOString().split("T")[0];

const Analytics = () => {
  const [overview, setOverview] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSalesTrend = async () => {
    try {
      const token = localStorage.getItem("token");

      // Generate last 30 days
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);

      const params = {
        start_date: formatDate(start),
        end_date: formatDate(end),
      };

      const res = await pythonApi.get(`/api/v1/analytics/sales-trend`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setOverview(res.data.analytics?.daily_totals || []);
    } catch (error) {
      console.error("Analytics API error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesTrend();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      <p className="text-sm text-gray-500 -mt-4">
        Loaded entries: {overview.length}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ------- Sales Trend Chart -------- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sales Trend (Last 30 Days)
          </h3>

          <div className="h-64 bg-gray-50 rounded-lg p-2">
            {loading ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                Loading...
              </div>
            ) : overview.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overview}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* -------- Right Panel: Key Metrics -------- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Metrics
          </h3>

          <div className="space-y-4">
            {[
              "Conversion Rate",
              "Avg. Order Value",
              "Customer Retention",
              "Bounce Rate",
            ].map((metric, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-700">{metric}</span>
                <span className="text-sm font-bold text-primary-600">
                  {["4.2%", "$124.50", "78%", "12%"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
