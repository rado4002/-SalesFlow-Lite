// src/pages/Inventory.tsx
import { useEffect, useMemo, useState } from "react";
import { inventoryAPI } from "../services/inventoryAPI";
import { productAPI } from "../services/productAPI";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Package, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { InventoryItem } from "../types/inventory";
import type { Product } from "../types/product";

type SortKey = "name" | "quantity" | "price" | "cost" | "category" | "sku";
type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

export default function Inventory() {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");

  // LOAD DATA
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const [invRes, prodRes] = await Promise.all([
        inventoryAPI.getAll(),
        productAPI.getAll(),
      ]);
      setInventory(invRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err: any) {
      console.error(err);
      setError(t("inventory.errors.load"));
      toast.error(t("inventory.errors.loadToast"));
    } finally {
      setLoading(false);
    }
  }

  // FILTER + SORT + PAGINATION
  const filtered = useMemo(() => {
    let list = [...inventory];
    const q = search.toLowerCase().trim();

    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.sku.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const dir = sort.direction === "asc" ? 1 : -1;

      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });

    return list;
  }, [inventory, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  // MODAL HANDLERS
  const resetModals = () => {
    setSelectedItem(null);
    setSelectedProduct(null);
    setQuantity("");
    setCost("");
  };

  const openEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setQuantity(item.quantity.toString());
    setCost(item.cost?.toString() ?? item.price.toString());
    setEditModalOpen(true);
  };

  const openDelete = (item: InventoryItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      toast.error("Select a product and enter a valid quantity.");
      return;
    }

    try {
      await inventoryAPI.create(
        selectedProduct.sku,
        {
          cost: parseFloat(cost),
          quantity: parseInt(quantity),
        }
      );
      toast.success("Stock added successfully!");
      loadAll();
      setAddModalOpen(false);
      resetModals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add stock.");
    }
  };

  const handleEditStock = async () => {
    if (!selectedItem || !quantity || parseInt(quantity) < 0) {
      toast.error("Enter a valid quantity.");
      return;
    }

    try {
      await inventoryAPI.updateBySku(selectedItem.sku, {
        cost: parseFloat(cost),
        quantity: parseInt(quantity),
      } as any);
      toast.success("Stock updated!");
      loadAll();
      setEditModalOpen(false);
      resetModals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed.");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    try {
      await inventoryAPI.deleteBySku(selectedItem.sku);
      toast.success("Item removed from inventory.");
      loadAll();
      setDeleteModalOpen(false);
      resetModals();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Deletion failed.");
    }
  };

  // RENDER LOADING
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-2xl text-gray-600">
          {t("inventory.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      <div className="p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
              {t("inventory.title")}
            </h1>
            <p className="text-xl text-gray-600 mt-3">
              {t("inventory.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 transition shadow-xl"
          >
            <Plus className="w-6 h-6 mr-3" />
            {t("inventory.actions.addStock")}
          </button>
        </motion.div>

        {/* SEARCH */}
        <div className="mb-8 relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder={t("inventory.searchPlaceholder")}
            className="w-full pl-16 pr-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow">
            {error}
          </div>
        )}

        {/* TABLE */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-gray-200">
                <tr>
                  <th onClick={() => toggleSort("name")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.product")} {sort.key === "name" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("sku")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.sku")} {sort.key === "sku" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("quantity")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.stock")} {sort.key === "quantity" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("price")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.price")} {sort.key === "price" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("cost")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.cost")} {sort.key === "cost" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("category")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("inventory.table.category")} {sort.key === "category" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700">
                    {t("inventory.table.updated")}
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700">
                    {t("inventory.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map((item) => {
                  const isCritical = item.quantity === 0;
                  const isLow = item.quantity > 0 && item.quantity <= 10;

                  return (
                    <motion.tr
                      key={item.id}
                      whileHover={{ backgroundColor: "#f0f9ff" }}
                      className={`transition-all ${isCritical ? "bg-red-50" : isLow ? "bg-yellow-50" : ""}`}
                    >
                      <td className="px-8 py-6 font-medium text-gray-900">{item.name}</td>
                      <td className="px-8 py-6 text-gray-600 font-mono text-sm">{item.sku}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                          isCritical
                            ? "bg-red-100 text-red-800"
                            : isLow
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}>
                          {item.quantity}
                          {isCritical && ` ${t("inventory.stock.out")}`}
                          {isLow && ` ${t("inventory.stock.low")}`}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-semibold">${item.price.toFixed(2)}</td>
                      <td className="px-8 py-6 font-semibold text-gray-600">
                        ${item.cost?.toFixed(2)}
                      </td>
                      <td className="px-8 py-6 text-gray-600">{item.category || "—"}</td>
                      <td className="px-8 py-6 text-sm text-gray-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openEdit(item)}
                            className="p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title={t("inventory.actions.edit")}
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDelete(item)}
                            className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title={t("inventory.actions.remove")}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}

                {paged.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-500 text-xl">
                      {t("inventory.empty")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between px-8 py-6 bg-gray-50 border-t">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-6 py-3 border border-blue-300 text-blue-700 rounded-xl disabled:opacity-50 hover:bg-blue-50 transition font-medium"
            >
              {t("common.previous")}
            </button>
            <span className="text-lg font-semibold text-gray-700">
              {t("common.page")} <strong>{page}</strong> {t("common.of")} <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-6 py-3 border border-blue-300 text-blue-700 rounded-xl disabled:opacity-50 hover:bg-blue-50 transition font-medium"
            >
              {t("common.next")}
            </button>
          </div>
        </motion.div>

        {/* SUMMARY CARDS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-8 shadow-xl">
            <p className="text-lg opacity-90">
              {t("inventory.summary.total")}
            </p>
            <p className="text-5xl font-extrabold mt-2">{inventory.length}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-2xl p-8 shadow-xl">
            <p className="text-lg opacity-90">
              {t("inventory.summary.low")}
            </p>
            <p className="text-5xl font-extrabold mt-2">
              {inventory.filter(i => i.quantity > 0 && i.quantity <= 10).length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl p-8 shadow-xl">
            <p className="text-lg opacity-90">
              {t("inventory.summary.out")}
            </p>
            <p className="text-5xl font-extrabold mt-2">
              {inventory.filter(i => i.quantity === 0).length}
            </p>
          </div>
        </motion.div>
      </div>

      {/* MODAL ADD STOCK */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {t("inventory.modals.add.title")}
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("inventory.modals.add.select")}
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                  onChange={(e) => {
                    const prod = products.find(p => p.id === Number(e.target.value));
                    setSelectedProduct(prod || null);
                    if (prod) setCost(prod.price.toString());
                  }}
                >
                  <option value="">
                    {t("inventory.modals.add.choose")}
                  </option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — ${p.price.toFixed(2)}{p.category ? ` — ${p.category}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && (
                <div className="p-5 bg-blue-50 rounded-xl flex items-center gap-4">
                  <Package className="w-10 h-10 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">{selectedProduct.name}</p>
                    <p className="text-sm text-gray-600">SKU: {selectedProduct.sku}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("inventory.modals.add.quantity")}
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                  placeholder={t("inventory.modals.add.quantityPlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("inventory.modals.add.cost")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                  placeholder={t("inventory.modals.add.costPlaceholder")}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setAddModalOpen(false); resetModals(); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleAddStock}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition font-medium"
              >
                {t("inventory.actions.addStock")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDIT */}
      {editModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {t("inventory.modals.edit.title")}
            </h2>
            <div className="space-y-6">
              <div className="p-5 bg-gray-50 rounded-xl">
                <p className="font-semibold">{selectedItem.name}</p>
                <p className="text-sm text-gray-600">SKU: {selectedItem.sku}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {t("inventory.modals.edit.current")} {selectedItem.quantity} {t("common.units")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("inventory.modals.edit.newQuantity")}
                </label>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("inventory.modals.add.cost")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300"
                />
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => { setEditModalOpen(false); resetModals(); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleEditStock}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium"
              >
                {t("common.update")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {deleteModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {t("inventory.modals.delete.title")}
            </h2>
            <p className="text-gray-600 mb-8">
              This will remove <span className="font-semibold">{selectedItem.name}</span> from stock tracking.
              The product remains in the catalogue.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => { setDeleteModalOpen(false); resetModals(); }}
                className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                {t("common.remove")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}