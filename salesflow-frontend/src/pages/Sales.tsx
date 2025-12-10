// src/pages/Sales.tsx

import { useEffect, useState } from "react";
import { salesAPI } from "../services/salesAPI";
import { productAPI } from "../services/productAPI";
import { importExcelAPI } from "../services/importExcelAPI";

import type { SaleRaw, CreateSaleRequest } from "../types/sales";
import type { Product } from "../types/product";

// TYPE STRICT POUR LE FORM
interface CreateSaleItem {
  productId: number;
  quantity: number;
}

export default function Sales() {
  // SALES DATA
  const [sales, setSales] = useState<SaleRaw[]>([]);
  const [recentSales, setRecentSales] = useState<SaleRaw[]>([]);
  const [loading, setLoading] = useState(true);

  // PRODUCTS FOR DROPDOWN
  const [products, setProducts] = useState<Product[]>([]);

  // FORM STATE (CREATE SALE)
  const [items, setItems] = useState<CreateSaleItem[]>([
    { productId: 0, quantity: 1 },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IMPORT EXCEL STATE
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // LOAD DATA
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);

      const [salesRes, recentRes, productRes] = await Promise.all([
        salesAPI.getAllSales(),
        salesAPI.getRecentSales(),
        productAPI.getAll(),
      ]);

      setSales(salesRes.data);
      setRecentSales(recentRes.data);
      setProducts(productRes.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  }

  // FORM HANDLING -------------------
  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof CreateSaleItem,
    value: any
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // TOTAL CALCULATION
  const totalAmount = items.reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);

  // SUBMIT SALE -------------------------
  const submitSale = async () => {
    setSaving(true);
    setError(null);

    // VALIDATION
    for (const i of items) {
      if (!i.productId || i.productId <= 0) {
        setError("A product must be selected.");
        setSaving(false);
        return;
      }
      if (i.quantity <= 0) {
        setError("Quantity must be > 0.");
        setSaving(false);
        return;
      }
    }

    const payload: CreateSaleRequest = {
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    };

    try {
      await salesAPI.createSale(payload);
      await loadAll();
      setItems([{ productId: 0, quantity: 1 }]);
      alert("Sale recorded!");
    } catch (e) {
      console.error(e);
      setError("Failed to save sale.");
    } finally {
      setSaving(false);
    }
  };

  // IMPORT EXCEL ------------------------
  const handleImportExcel = async () => {
    if (!importFile) {
      setImportMessage("Please select an Excel file first.");
      return;
    }

    setImporting(true);
    setImportMessage(null);

    try {
      const res = await importExcelAPI.upload(importFile);
      setImportMessage(res.message || "Import completed successfully.");
      // On recharge les ventes après import
      await loadAll();
    } catch (e) {
      console.error(e);
      setImportMessage("Excel import failed.");
    } finally {
      setImporting(false);
    }
  };

  // RENDER UI --------------------------
  return (
    <div className="p-6 flex gap-6">
      {/* LEFT PANEL — CREATE SALE + IMPORT EXCEL */}
      <div className="w-[420px] space-y-6">
        {/* CREATE SALE CARD */}
        <div className="bg-white shadow rounded-xl p-5">
          <h1 className="text-xl font-bold mb-4">Create Sale</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
              {error}
            </div>
          )}

          {items.map((item, index) => (
            <div key={index} className="border p-3 rounded mb-4">
              {/* PRODUCT SELECT */}
              <label className="text-sm font-medium">Product</label>
              <select
                className="border rounded p-2 w-full mb-2"
                value={item.productId}
                onChange={(e) =>
                  updateItem(index, "productId", Number(e.target.value))
                }
              >
                <option value={0}>Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price}
                  </option>
                ))}
              </select>

              {/* QUANTITY */}
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                className="border rounded p-2 w-full"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value))
                }
              />

              {/* REMOVE ITEM */}
              {index > 0 && (
                <button
                  className="mt-2 text-red-600 text-sm"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button className="w-full border py-2 mb-3" onClick={addItem}>
            + Add Item
          </button>

          <div className="text-right font-semibold mb-3">
            Total: ${totalAmount}
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            disabled={saving}
            onClick={submitSale}
          >
            {saving ? "Saving..." : "Record Sale"}
          </button>
        </div>

        {/* IMPORT EXCEL CARD */}
        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">📥 Import Excel</h2>

          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />

          <button
            onClick={handleImportExcel}
            disabled={importing}
            className="mt-3 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded disabled:opacity-50"
          >
            {importing ? "Importing…" : "Run Import"}
          </button>

          {importMessage && (
            <p className="mt-2 text-sm text-gray-700">{importMessage}</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL — SALES LIST */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-3">All Sales</h2>

        {loading ? (
          <p>Loading sales...</p>
        ) : (
          <div className="bg-white shadow rounded-xl p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2">Items</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id} className="border-b">
                    <td className="py-2">
                      {new Date(s.saleDate).toLocaleString()}
                    </td>
                    <td className="py-2">${s.totalAmount}</td>
                    <td className="py-2">{s.items.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="text-xl font-bold mt-6 mb-3">Recent Sales</h2>
        <div className="bg-white shadow rounded-xl p-4">
          {recentSales.map((s) => (
            <div key={s.id} className="border-b py-2">
              <p>
                <strong>{s.items.length}</strong> items —{" "}
                <strong>${s.totalAmount}</strong>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(s.saleDate).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
