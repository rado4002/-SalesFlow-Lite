// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../api/http";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalSales: 0,
    itemsInStock: 0,
    pendingOrders: 0,
    revenueToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Try online first
        const [salesRes, inventoryRes, ordersRes] = await Promise.all([
          api.get("/api/v1/sales/today"),
          api.get("/api/v1/inventory/stats"),
          api.get("/api/v1/orders/pending"),
        ]);

        setStats({
          totalSales: salesRes.data.total || 0,
          itemsInStock: inventoryRes.data.inStock || 0,
          pendingOrders: ordersRes.data.count || 0,
          revenueToday: salesRes.data.revenue || 0,
        });
      } catch (err) {
        // Offline fallback - use cached data if available
        const cached = localStorage.getItem("dashboardStats");
        if (cached) {
          setStats(JSON.parse(cached));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Save to cache on update
    const saveToCache = () => {
      localStorage.setItem("dashboardStats", JSON.stringify(stats));
    };
    window.addEventListener("beforeunload", saveToCache);
    return () => window.removeEventListener("beforeunload", saveToCache);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-extrabold mb-2">
          {t("welcome", { name: user?.username || "Merchant" })} 👋
        </h1>
        <p className="text-indigo-100 text-lg opacity-90">
          {t("dashboard_welcome")}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold">
              {user?.username?.[0]?.toUpperCase() || "M"}
            </span>
          </div>
          <div>
            <p className="font-semibold">{user?.username}</p>
            <p className="text-sm opacity-80">
              {user?.organization || "My Shop"} • {t(`roles.${user?.role}`)}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue Today */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t("today_revenue")}</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(stats.revenueToday)}</p>
            </div>
            <TrendingUp size={40} className="opacity-70" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">{t("total_sales")}</p>
              <p className="text-3xl font-bold mt-2">{stats.totalSales.toLocaleString()}</p>
            </div>
            <DollarSign size={40} className="opacity-70" />
          </div>
        </div>

        {/* Items in Stock */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">{t("in_stock")}</p>
              <p className="text-3xl font-bold mt-2">{stats.itemsInStock}</p>
            </div>
            <Package size={40} className="opacity-70" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">{t("pending_orders")}</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <ShoppingCart size={40} className="opacity-70" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition text-left">
          <Package className="w-10 h-10 text-indigo-600 mb-3" />
          <p className="font-semibold">{t("add_product")}</p>
          <p className="text-sm text-gray-500">{t("quick_action")}</p>
        </button>
        <button className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition text-left">
          <ShoppingCart className="w-10 h-10 text-green-600 mb-3" />
          <p className="font-semibold">{t("new_sale")}</p>
          <p className="text-sm text-gray-500">{t("quick_action")}</p>
        </button>
        <button className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition text-left">
          <Users className="w-10 h-10 text-purple-600 mb-3" />
          <p className="font-semibold">{t("add_customer")}</p>
          <p className="text-sm text-gray-500">{t("quick_action")}</p>
        </button>
        <button className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition text-left">
          <BarChart3 className="w-10 h-10 text-orange-600 mb-3" />
          <p className="font-semibold">{t("view_reports")}</p>
          <p className="text-sm text-gray-500">{t("quick_action")}</p>
        </button>
      </div>
    </div>
  );
}