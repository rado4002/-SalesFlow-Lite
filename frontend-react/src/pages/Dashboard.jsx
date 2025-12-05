// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../api/http";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";

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
    async function load() {
      try {
        const [sales, inventory, orders] = await Promise.all([
          api.get("/api/v1/sales/today"),
          api.get("/api/v1/inventory/stats"),
          api.get("/api/v1/orders/pending"),
        ]);

        setStats({
          totalSales: sales.data.total ?? 0,
          itemsInStock: inventory.data.inStock ?? 0,
          pendingOrders: orders.data.count ?? 0,
          revenueToday: sales.data.revenue ?? 0,
        });
      } catch (e) {
        const fallback = localStorage.getItem("dashboardStats");
        if (fallback) setStats(JSON.parse(fallback));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboardStats", JSON.stringify(stats));
  }, [stats]);

  const currency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="space-y-10">

      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl">
        <h1 className="text-4xl font-extrabold mb-1">
          {t("welcome", { name: user.username })}
        </h1>
        <p className="text-indigo-100">{t("dashboard_welcome")}</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-white">{user.username}</p>
            <p className="text-sm text-indigo-200">
              {user.organization || "My Shop"} • {t(`roles.${user.role}`)}
            </p>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title={t("today_revenue")}
          value={currency(stats.revenueToday)}
          icon={<TrendingUp size={40} />}
          gradient="from-emerald-500 to-teal-600"
        />

        <StatCard
          title={t("total_sales")}
          value={stats.totalSales.toLocaleString()}
          icon={<DollarSign size={40} />}
          gradient="from-indigo-500 to-indigo-700"
        />

        <StatCard
          title={t("in_stock")}
          value={stats.itemsInStock}
          icon={<Package size={40} />}
          gradient="from-orange-500 to-red-600"
        />

        <StatCard
          title={t("pending_orders")}
          value={stats.pendingOrders}
          icon={<ShoppingCart size={40} />}
          gradient="from-purple-500 to-pink-600"
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ActionCard icon={<Package />} label={t("add_product")} />
        <ActionCard icon={<ShoppingCart />} label={t("new_sale")} />
        <ActionCard icon={<Users />} label={t("add_customer")} />
        <ActionCard icon={<BarChart3 />} label={t("view_reports")} />
      </div>

    </div>
  );
}

function StatCard({ title, value, icon, gradient }) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} text-white p-6 rounded-2xl shadow-lg transform hover:scale-105 transition`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="opacity-70">{icon}</div>
      </div>
    </div>
  );
}

function ActionCard({ icon, label }) {
  return (
    <button className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow hover:shadow-lg transition text-left">
      <div className="w-10 h-10 mb-3 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Quick action</p>
    </button>
  );
}
