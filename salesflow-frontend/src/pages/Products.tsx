// src/pages/Products.tsx
import { useEffect, useMemo, useState } from "react";
import { productAPI } from "../services/productAPI";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

type SortKey = "name" | "price" | "sku" | "category";
type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

type Mode = "idle" | "create" | "view" | "edit";

const EMPTY_FORM: Omit<Product, "id"> = {
  name: "",
  sku: "",
  price: 0,
  description: "",
  imageUrl: "",
  category: "",
};

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id"> | Product | null>(null);
  const [mode, setMode] = useState<Mode>("idle");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const navigate = useNavigate();

  // LOAD PRODUCTS
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const res = await productAPI.getAll();
      setProducts(res.data || []);

      if (selected) {
        const updated = res.data.find((p: Product) => p.id === selected.id);
        setSelected(updated ?? null);
        if (mode === "view" || mode === "edit") setForm(updated ?? null);
      }
    } catch (e) {
      console.error(e);
      setError(t("products.errors.load"));
    }
  }

  // FILTER + SORT + PAGINATION
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list: Product[] = [...products];

    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      const { key, direction } = sort;
      const dir = direction === "asc" ? 1 : -1;
      const av = a[key];
      const bv = b[key];

      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av ?? "").localeCompare(String(bv ?? "")) * dir;
    });

    return list;
  }, [products, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  // CRUD HANDLERS
  const startCreate = () => {
    setMode("create");
    setSelected(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
  };

  const selectProduct = async (id: number) => {
    try {
      setError(null);
      const res = await productAPI.getById(id);
      const product = res.data;
      setSelected(product);
      setForm(product);
      setMode("view");
    } catch (e) {
      console.error(e);
      toast.error(t("products.errors.loadDetails"));
    }
  };

  const enterEditMode = () => {
    if (!selected) return;
    setMode("edit");
  };

  const cancelEditOrCreate = () => {
    if (mode === "create") {
      setMode("idle");
      setForm(null);
      setSelected(null);
    } else if (selected) {
      setForm(selected);
      setMode("view");
    }
  };

  const handleInput = (
    field: keyof Omit<Product, "id">,
    value: string | number
  ) => {
    if (!form) return;
    setForm((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    setError(null);

    const payload = {
      name: String(form.name).trim(),
      sku: String(form.sku).trim(),
      price: Number(form.price) || 0,
      description: form.description?.trim() || null,
      imageUrl: form.imageUrl?.trim() || null,
      category: form.category?.trim() || null,
    };

    if (!payload.name || !payload.sku) {
      toast.error(t("products.errors.required"));
      setSaving(false);
      return;
    }

    try {
      let updatedProduct;
      if (mode === "edit" && selected?.sku) {
        updatedProduct = await productAPI.updateBySku(selected.sku, payload);
      } else {
        updatedProduct = await productAPI.create(payload);
      }

      toast.success(t("products.success.saved"));
      await loadProducts();
      setSelected(updatedProduct.data);
      setForm(updatedProduct.data);
      setMode("view");
    } catch (e: any) {
      toast.error(e.response?.data?.message || t("products.errors.save"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !confirm(t("products.confirmDelete"))) return;

    try {
      setSaving(true);
      await productAPI.delete(selected.id);
      toast.success(t("products.success.deleted"));
      await loadProducts();
      setSelected(null);
      setForm(null);
      setMode("idle");
    } catch (e) {
      toast.error(t("products.errors.delete"));
    } finally {
      setSaving(false);
    }
  };

  // RENDER
  return (
    <div className="p-6 flex gap-8 min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50">
      {/* LEFT: CATALOGUE TABLE */}
      <div className="flex-1">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 text-transparent bg-clip-text">
              {t("products.title")}
            </h1>
            <button
              onClick={startCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              + {t("products.actions.add")}
            </button>
          </div>
          <p className="text-xl text-gray-600 mt-3">
            {t("products.subtitle")}
          </p>
        </motion.div>

        <input
          type="text"
          placeholder={t("products.search")}
          className="w-full max-w-2xl px-6 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 mb-8 shadow-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow">
            {error}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <tr>
                  <th onClick={() => toggleSort("name")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("products.table.name")} {sort.key === "name" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("sku")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("products.table.sku")} {sort.key === "sku" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("price")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("products.table.price")} {sort.key === "price" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => toggleSort("category")} className="px-8 py-5 text-left text-sm font-bold text-gray-700 cursor-pointer hover:bg-blue-100 transition">
                    {t("products.table.category")} {sort.key === "category" && (sort.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-8 py-5 text-left text-sm font-bold text-gray-700">
                    {t("products.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedProducts.map((p) => (
                  <motion.tr
                    key={p.id}
                    whileHover={{ backgroundColor: "#f0f9ff" }}
                    className={`cursor-pointer transition-all ${selected?.id === p.id ? "bg-blue-50 border-l-4 border-blue-600" : ""}`}
                    onClick={() => selectProduct(p.id!)}
                  >
                    <td className="px-8 py-6 font-medium text-gray-900">{p.name}</td>
                    <td className="px-8 py-6 text-gray-600 font-mono">{p.sku}</td>
                    <td className="px-8 py-6 font-semibold text-blue-700">${p.price.toFixed(2)}</td>
                    <td className="px-8 py-6 text-gray-600">{p.category || "—"}</td>
                    <td className="px-8 py-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/inventory?productId=${p.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium underline"
                      >
                        {t("products.actions.manageStock")} →
                      </button>
                    </td>
                  </motion.tr>
                ))}
                {pagedProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-16 text-gray-500 text-xl">
                      {t("products.empty")}
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
      </div>

      {/* RIGHT PANEL — DETAILED VIEW / FORM */}
      <div className="w-96">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-6 min-h-[600px] flex flex-col">
          {mode === "idle" && (
            <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-32 h-32 mb-6" />
              <p className="text-2xl text-gray-500">
                {t("products.emptySelection")}
              </p>
            </div>
          )}

          {(mode === "view" || mode === "edit" || mode === "create") && form && (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">
                  {mode === "create" ? t("products.form.new") : form.name}
                </h2>
                {mode === "view" && (
                  <button
                    onClick={enterEditMode}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {t("common.edit")}
                  </button>
                )}
                {(mode === "edit" || mode === "create") && (
                  <button onClick={cancelEditOrCreate} className="text-gray-500 hover:text-gray-700 text-2xl">
                    ✕
                  </button>
                )}
              </div>

              {/* Product Image */}
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt={form.name}
                  className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/600x400?text=No+Image")}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-64 mb-6 flex items-center justify-center">
                  <span className="text-gray-500">
                    {t("products.form.noImage")}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("products.form.name")}
                  </label>
                  {mode === "view" ? (
                    <p className="text-xl font-semibold text-gray-900">{form.name}</p>
                  ) : (
                    <input
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1"
                      value={form.name}
                      onChange={(e) => handleInput("name", e.target.value)}
                    />
                  )}
                </div>

                {form.description && mode === "view" && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("products.form.description")}
                    </label>
                    <p className="text-gray-700">{form.description}</p>
                  </div>
                )}

                {mode !== "view" && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("products.form.description")}
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1 resize-none"
                      value={form.description || ""}
                      onChange={(e) => handleInput("description", e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("products.form.price")}
                  </label>
                  {mode === "view" ? (
                    <p className="text-xl font-bold text-blue-700">${Number(form.price).toFixed(2)}</p>
                  ) : (
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1"
                      value={form.price}
                      onChange={(e) => handleInput("price", parseFloat(e.target.value) || 0)}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("products.form.sku")}
                  </label>
                  {mode === "view" ? (
                    <p className="font-mono text-gray-800">{form.sku}</p>
                  ) : (
                    <input
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1 font-mono"
                      value={form.sku}
                      onChange={(e) => handleInput("sku", e.target.value)}
                    />
                  )}
                </div>

                {(form.category || mode !== "view") && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("products.form.category")}
                    </label>
                    {mode === "view" ? (
                      <p className="text-gray-700">{form.category}</p>
                    ) : (
                      <input
                        className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1"
                        value={form.category || ""}
                        onChange={(e) => handleInput("category", e.target.value)}
                      />
                    )}
                  </div>
                )}

                {mode !== "view" && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t("products.form.image")}
                    </label>
                    <input
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-300 mt-1"
                      value={form.imageUrl || ""}
                      onChange={(e) => handleInput("imageUrl", e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {(mode === "create" || mode === "edit") && (
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition shadow-lg"
                  >
                    {saving ? t("common.saving") : t("common.save")}
                  </button>
                  {mode === "edit" && (
                    <button
                      onClick={handleDelete}
                      disabled={saving}
                      className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 transition shadow-lg"
                    >
                      {t("common.delete")}
                    </button>
                  )}
                </div>
              )}

              {mode === "view" && (
                <div className="mt-8">
                  <button
                    onClick={() => navigate(`/inventory?productId=${selected?.id}`)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition"
                  >
                    {t("products.actions.manageStock")} →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}