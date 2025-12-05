// src/pages/Inventory/InventoryList.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Search, Plus, Package, AlertTriangle, Filter, Edit, Trash2 } from "lucide-react";
import api from "../../api/http";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function InventoryList() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all, low, out
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.get("/api/v1/inventory").then(res => res.data),
    staleTime: 1000 * 60, // 1 min
    cacheTime: 1000 * 60 * 5, // 5 min
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/v1/inventory/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm(t("confirm_delete"))) {
      deleteMutation.mutate(id);
    }
  };

  const filtered = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.sku.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "all" ? true :
                           filter === "low" ? item.quantity <= item.lowStockThreshold :
                           item.quantity === 0;
      return matchesSearch && matchesFilter;
    });

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              {t("inventory")}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {items.length} {t("items_total")}
            </p>
          </div>
          <Link
            to="/inventory/add"
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg"
          >
            <Plus size={20} />
            {t("inventory_add")}
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => setFilter(filter === "all" ? "low" : filter === "low" ? "out" : "all")}
            className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <Filter size={18} />
            {filter === "all" ? t("filter_all") : filter === "low" ? t("filter_low") : t("filter_out")}
          </button>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-24 mb-6"></div>
              <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <div
            key={item.id}
            className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1 relative group"
          >
            {/* Stock Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl p-3">
                <Package size={28} className="text-indigo-600" />
              </div>
              {item.quantity === 0 && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {t("out_of_stock")}
                </span>
              )}
              {item.quantity > 0 && item.quantity <= item.lowStockThreshold && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <AlertTriangle size={12} />
                  {t("low_stock")}
                </span>
              )}
            </div>

            {/* Item Info */}
            <Link to={`/inventory/${item.id}`} className="block">
              <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                {item.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                SKU: {item.sku}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-indigo-600">
                    {item.quantity}
                  </p>
                  <p className="text-xs text-slate-500">{t("in_stock")}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(item.price)}
                  </p>
                  <p className="text-xs text-slate-500">{t("unit_price")}</p>
                </div>
              </div>
            </Link>

            {/* Action Buttons (on hover) */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link
                to={`/inventory/edit/${item.id}`}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition text-sm font-medium"
              >
                <Edit size={16} />
                {t("edit")}
              </Link>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition text-sm font-medium disabled:opacity-50"
              >
                <Trash2 size={16} />
                {t("delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {search || filter !== "all" ? t("no_results") : t("empty_inventory")}
          </p>
        </div>
      )}
    </div>
  );
}