// src/pages/Inventory.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { inventoryAPI } from "../services/inventoryAPI";
import type { InventoryItem } from "../types/inventory";

type SortKey = "name" | "quantity" | "price" | "category";
type SortDirection = "asc" | "desc";

interface SortState {
  key: SortKey;
  direction: SortDirection;
}

type Mode = "idle" | "create" | "edit";

const EMPTY_FORM: Omit<InventoryItem, "id"> = {
  name: "",
  description: "",
  quantity: 0,
  price: 0,
  cost: 0,
  category: "",
};

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selected, setSelected] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<Omit<InventoryItem, "id"> | InventoryItem | null>(null);
  const [mode, setMode] = useState<Mode>("idle");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [sort, setSort] = useState<SortState>({ key: "name", direction: "asc" });
  const [searchParams] = useSearchParams();
  const scrollRef = useRef<HTMLTableRowElement | null>(null);

  const urlProductId = searchParams.get("productId");

  // ---------------------------------------------------
  // LOAD INVENTORY
  // ---------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        const res = await inventoryAPI.getAll();
        setInventory(res.data);

        // Auto-select via ?productId=
        if (urlProductId) {
          const id = Number(urlProductId);
          const found = res.data.find((i: InventoryItem) => i.id === id);
          if (found) {
            setSelected(found);
            setForm(found);
            setMode("edit");
          }
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load inventory items.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // ---------------------------------------------------
  // AUTO SCROLL
  // ---------------------------------------------------
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  // ---------------------------------------------------
  // FILTER + SORT
  // ---------------------------------------------------
  const filtered = useMemo(() => {
    let list = inventory;
    const q = search.toLowerCase().trim();

    if (q) {
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const dir = sort.direction === "asc" ? 1 : -1;

      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;

      return String(av).localeCompare(String(bv)) * dir;
    });

    return list;
  }, [inventory, search, sort]);

  // ---------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // CRUD HANDLERS
  // ---------------------------------------------------
  const startCreate = () => {
    setMode("create");
    setSelected(null);
    setForm({ ...EMPTY_FORM });
  };

  const selectItem = (item: InventoryItem) => {
    setSelected(item);
    setForm(item);
    setMode("edit");
  };

  const handleInput = (field: keyof Omit<InventoryItem, "id">, value: any) => {
    if (!form) return;
    setForm({ ...(form as any), [field]: value });
  };

  const handleSave = async () => {
    if (!form) return;

    setSaving(true);
    setError(null);

    try {
      // UPDATE
      if (mode === "edit" && (form as InventoryItem).id) {
        const f = form as InventoryItem;
        await inventoryAPI.update(f.id!, {
          name: f.name,
          description: f.description,
          quantity: f.quantity,
          price: f.price,
          cost: f.cost,
          category: f.category,
        });
      }
      // CREATE
      else if (mode === "create") {
        const f = form as Omit<InventoryItem, "id">;
        await inventoryAPI.create(f);
      }

      const res = await inventoryAPI.getAll();
      setInventory(res.data);

      alert("Saved successfully!");
      if (mode === "create") setForm({ ...EMPTY_FORM });
    } catch (err) {
      console.error(err);
      setError("Failed to save item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected || !selected.id) return;
    if (!confirm("Delete this inventory item?")) return;

    try {
      await inventoryAPI.delete(selected.id);

      const res = await inventoryAPI.getAll();
      setInventory(res.data);

      setSelected(null);
      setForm(null);
      setMode("idle");
      alert("Item deleted.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
    }
  };

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  if (loading) return <p className="p-6">Loading inventory...</p>;

  return (
    <div className="p-6 flex gap-6">

      {/* ---------------- LEFT SIDE : TABLE ---------------- */}
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Inventory</h1>

          <button
            onClick={startCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          >
            + Add Item
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name or category..."
          className="border rounded px-3 py-2 w-64 mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {error && (
          <div className="mb-3 text-red-600 bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm">
                <th className="cursor-pointer" onClick={() => toggleSort("name")}>Name</th>
                <th className="cursor-pointer" onClick={() => toggleSort("quantity")}>Qty</th>
                <th className="cursor-pointer" onClick={() => toggleSort("price")}>Price</th>
                <th className="cursor-pointer" onClick={() => toggleSort("category")}>Category</th>
              </tr>
            </thead>

            <tbody>
              {paged.map((item) => (
                <tr
                  key={item.id}
                  ref={selected?.id === item.id ? scrollRef : null}
                  className={`border-b hover:bg-gray-100 cursor-pointer ${
                    selected?.id === item.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => selectItem(item)}
                >
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                </tr>
              ))}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span>Page {page} / {totalPages}</span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- RIGHT SIDE : PANEL FORM ---------------- */}
      <div className="w-96 bg-white shadow rounded-xl p-4">
        {!form ? (
          <p>Select an item or click “Add Item”.</p>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-3">
              {mode === "create" ? "Add Inventory Item" : "Edit Inventory Item"}
            </h2>

            {/* Editable inputs */}
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 rounded w-full mb-2"
              value={form.name}
              onChange={(e) => handleInput("name", e.target.value)}
            />

            <label className="block text-sm mb-1">Description</label>
            <input
              className="border p-2 rounded w-full mb-2"
              value={form.description}
              onChange={(e) => handleInput("description", e.target.value)}
            />

            <label className="block text-sm mb-1">Quantity</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={form.quantity}
              onChange={(e) => handleInput("quantity", parseInt(e.target.value) || 0)}
            />

            <label className="block text-sm mb-1">Price</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={form.price}
              onChange={(e) => handleInput("price", parseFloat(e.target.value) || 0)}
            />

            <label className="block text-sm mb-1">Cost</label>
            <input
              type="number"
              className="border p-2 rounded w-full mb-2"
              value={form.cost}
              onChange={(e) => handleInput("cost", parseFloat(e.target.value) || 0)}
            />

            <label className="block text-sm mb-1">Category</label>
            <input
              className="border p-2 rounded w-full mb-4"
              value={form.category}
              onChange={(e) => handleInput("category", e.target.value)}
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>

              {mode === "edit" && (
                <button
                  onClick={handleDelete}
                  className="flex-1 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
