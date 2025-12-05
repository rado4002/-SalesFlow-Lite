// src/pages/orders/OrdersList.jsx
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Plus, Package, Clock, CheckCircle, XCircle } from "lucide-react";
import api from "../../api/http";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function OrdersList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get("/api/v1/orders").then(res => res.data),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
  });

  const filtered = orders.filter(order =>
    order.id.toString().includes(search) ||
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock size={16} className="text-yellow-600" />;
      case "COMPLETED": return <CheckCircle size={16} className="text-green-600" />;
      case "CANCELLED": return <XCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              {t("orders")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {orders.length} {t("orders_total")}
            </p>
          </div>
          <Link
            to="/orders/create"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            <Plus size={20} />
            {t("new_order")}
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={t("search_orders")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded mb-3 w-32"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-48 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {filtered.map(order => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block bg-white dark:bg-neutral-900 rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl p-2">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                    #{order.id}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {order.customerName}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {t(`order_status_${order.status.toLowerCase()}`)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <p className="text-slate-600 dark:text-slate-400">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="font-bold text-indigo-600">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.total)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {search ? t("no_orders_found") : t("no_orders_yet")}
          </p>
        </div>
      )}
    </div>
  );
}