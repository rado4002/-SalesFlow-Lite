// src/pages/Products.tsx
import { useEffect, useMemo, useState } from "react";
import { productAPI } from "../services/productAPI";
import type { Product } from "../types/product";
import { useNavigate } from "react-router-dom";

type SortKey = "name" | "price" | "stockQuantity" | "sku";
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
  stockQuantity: 0,
  description: "",
  imageUrl: "",
  lowStockThreshold: 1,
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id"> | Product | null>(null);
  const [mode, setMode] = useState<Mode>("idle");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const navigate = useNavigate();

  // ------------------------
  // LOAD PRODUCTS
  // ------------------------
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await productAPI.getAll();
      setProducts(res.data);

      if (selected) {
        const updated = res.data.find((p: Product) => p.id === selected.id);
        setSelected(updated ?? null);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  // ------------------------
  // FILTER + SORT + PAGINATION
  // ------------------------
  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list: Product[] = [...products];

    if (q) {
      list = list.filter(
        (p: Product) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    list.sort((a: Product, b: Product) => {
      const { key, direction } = sort;
      const dir = direction === "asc" ? 1 : -1;
      const av = a[key];
      const bv = b[key];

      if (typeof av === "number" && typeof bv === "number") {
        return (av - bv) * dir;
      }
      return String(av).localeCompare(String(bv)) * dir;
    });

    return list;
  }, [products, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, page]);

  const toggleSort = (key: SortKey) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // ------------------------
  // CRUD HANDLERS
  // ------------------------
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
      setSelected(res.data);
      setForm(res.data);
      setMode("view"); // ← Toujours ouvrir en mode VIEW
    } catch (e) {
      console.error(e);
      setError("Failed to load product.");
    }
  };

  const enterEditMode = () => {
    if (!selected) return;
    setForm({ ...selected });
    setMode("edit");
  };

  const cancelEditOrCreate = () => {
    if (mode === "create") {
      setMode("idle");
      setForm(null);
    } else if (selected) {
      setForm(selected);
      setMode("view");
    }
  };

  const handleInput = (field: keyof Omit<Product, "id">, value: string | number) => {
    if (!form) return;
    setForm(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    setError(null);

    const payload = {
      name: String(form.name).trim(),
      sku: String(form.sku).trim(),
      price: Number(form.price) || 0,
      stockQuantity: Number(form.stockQuantity) || 0,
      description: String(form.description ?? "").trim(),
      imageUrl: String(form.imageUrl ?? "").trim(),
      lowStockThreshold: Number(form.lowStockThreshold) || 1,
    };

    if (!payload.name || !payload.sku) {
      setError("Name and SKU are required.");
      setSaving(false);
      return;
    }

    try {
      if (mode === "edit" && "id" in form && form.id) {
        await productAPI.update(form.id, payload);
      } else {
        const created = await productAPI.create(payload);
        setSelected(created.data);
        setForm(created.data);
      }

      await loadProducts();
      alert("Product saved successfully!");

      // Après sauvegarde → retour en mode VIEW
      setMode("view");
    } catch (e) {
      console.error(e);
      setError("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !confirm("Delete this product permanently?")) return;

    try {
      setSaving(true);
      await productAPI.delete(selected.id!);
      await loadProducts();
      setSelected(null);
      setForm(null);
      setMode("idle");
      alert("Product deleted.");
    } catch (e) {
      console.error(e);
      setError("Failed to delete product.");
    } finally {
      setSaving(false);
    }
  };

  // ------------------------
  // RENDER
  // ------------------------
  return (
    <div className="p-6 flex gap-6">
      {/* LEFT TABLE */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Products</h1>
          <button
            onClick={startCreate}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
          >
            + Add Product
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="px-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="text-gray-600">{filteredProducts.length} result(s)</span>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading products...</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    <th onClick={() => toggleSort("name")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">Name</th>
                    <th onClick={() => toggleSort("price")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">Price</th>
                    <th onClick={() => toggleSort("stockQuantity")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">Stock</th>
                    <th onClick={() => toggleSort("sku")} className="px-6 py-4 cursor-pointer hover:bg-gray-100">SKU</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pagedProducts.map((p: Product) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-gray-50 cursor-pointer transition ${selected?.id === p.id ? "bg-blue-50" : ""}`}
                      onClick={() => selectProduct(p.id!)}
                    >
                      <td className="px-6 py-4 font-medium">{p.name}</td>
                      <td className="px-6 py-4">${Number(p.price).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          p.stockQuantity === 0 ? "bg-red-100 text-red-800" :
                          p.stockQuantity < p.lowStockThreshold ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {p.stockQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.sku}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/inventory?productId=${p.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Stock →
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pagedProducts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t text-sm">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-96">
        <div className="bg-white rounded-xl shadow p-6 sticky top-6 min-h-[500px]">
          {/* IDLE */}
          {mode === "idle" && (
            <p className="text-center text-gray-500 mt-10">
              Select a product or click “Add Product” to begin.
            </p>
          )}

          {/* VIEW MODE */}
          {mode === "view" && selected && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">Product Details</h2>
                <button
                  onClick={enterEditMode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
              </div>

              {selected.imageUrl && (
                <img
                  src={selected.imageUrl}
                  alt={selected.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image")}
                />
              )}

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Name:</span>{" "}
                  <span className="text-gray-900">{selected.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">SKU:</span>{" "}
                  <span className="text-gray-900">{selected.sku}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Price:</span>{" "}
                  <span className="text-gray-900">${Number(selected.price).toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Stock Quantity:</span>{" "}
                  <span className="text-gray-900">{selected.stockQuantity}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Low Stock Threshold:</span>{" "}
                  <span className="text-gray-900">{selected.lowStockThreshold}</span>
                </div>
                {selected.description && (
                  <div>
                    <span className="font-semibold text-gray-700">Description:</span>
                    <p className="text-gray-900 mt-1">{selected.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREATE & EDIT MODE */}
          {(mode === "create" || mode === "edit") && form && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {mode === "create" ? "Add New Product" : "Edit Product"}
                </h2>
                {mode === "edit" && (
                  <button
                    onClick={cancelEditOrCreate}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt={form.name}
                  className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
                  onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=No+Image")}
                />
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={form.name}
                    onChange={e => handleInput("name", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">SKU *</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={form.sku}
                    onChange={e => handleInput("sku", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.price}
                    onChange={e => handleInput("price", parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.stockQuantity}
                    onChange={e => handleInput("stockQuantity", parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.lowStockThreshold}
                    onChange={e => handleInput("lowStockThreshold", parseInt(e.target.value) || 1)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.description}
                    onChange={e => handleInput("description", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.imageUrl}
                    onChange={e => handleInput("imageUrl", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>

                {mode === "edit" && (
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {saving ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}