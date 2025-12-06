import { useEffect, useState } from "react";
import { pythonApi } from "../services/api";

interface StockAlert {
  product_id: number;
  message: string;
  severity: "low" | "medium" | "high";
}

const StockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await pythonApi.get("/api/v1/stock/alerts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend returns: { status, mode, alerts: [...] }
      setAlerts(res.data.alerts || []);

    } catch (error) {
      console.error("Error fetching stock alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading stock alerts...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-gray-900">Stock Alerts</h1>
      <p className="text-gray-600">Products with low or critical stock levels</p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Product ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Message</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Severity</th>
            </tr>
          </thead>

          <tbody>
            {alerts.map((alert, idx) => {
              const badgeColor: Record<string, string> = {
                low: "bg-yellow-100 text-yellow-700",
                medium: "bg-orange-100 text-orange-700",
                high: "bg-red-100 text-red-700",
              };

              return (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {alert.product_id}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {alert.message}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        badgeColor[alert.severity] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {alert.severity.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default StockAlerts;
