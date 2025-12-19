// src/pages/Sales.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Upload, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

import { productAPI } from "../services/productAPI";
import { salesAPI } from "../services/salesAPI";
import { importExcelAPI } from "../services/importExcelAPI";

import type { Product } from "../types/product";
import type {
  Sale,
  SalesHistoryPoint,
  CreateSaleRequest,
} from "../types/sales";

// --------------------------------------------------
// LOCAL FORM TYPE (CREATE SALE ONLY)
// --------------------------------------------------
interface SaleItemForm {
  productId: number;
  quantity: number;
}

export default function Sales() {
  const { t } = useTranslation();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------
  const [sales, setSales] = useState<Sale[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Create sale form
  const [items, setItems] = useState<SaleItemForm[]>([
    { productId: 0, quantity: 1 },
  ]);

  // Import Excel
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<"sku" | "name">("sku");
  const [searchResults, setSearchResults] =
    useState<SalesHistoryPoint[] | null>(null);
  const [searching, setSearching] = useState(false);

  // --------------------------------------------------
  // LOAD INITIAL DATA
  // --------------------------------------------------
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);

      const [history, recent, productsRes] = await Promise.all([
        salesAPI.getSalesHistory(),
        salesAPI.getRecentSales(),
        productAPI.getAll(),
      ]);

      setSales(history);
      setRecentSales(recent);
      setProducts(productsRes.data);

      if (recent.length > 0) {
        setSelectedSale(recent[0]);
      }
    } catch {
      toast.error(t("sales.errors.load"));
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CREATE SALE
  // --------------------------------------------------
  const addItem = () =>
    setItems([...items, { productId: 0, quantity: 1 }]);

  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const updateItem = (
    index: number,
    field: keyof SaleItemForm,
    value: number
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalPreview = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const submitSale = async () => {
    const invalid = items.find(
      (i) => i.productId <= 0 || i.quantity <= 0
    );
    if (invalid) {
      toast.error(t("sales.errors.invalidItems"));
      return;
    }

    setSaving(true);
    try {
      const payload: CreateSaleRequest = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      };

      await salesAPI.createSale(payload);
      toast.success(t("sales.success.created"));

      setItems([{ productId: 0, quantity: 1 }]);
      await loadAllData();
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // IMPORT EXCEL
  // --------------------------------------------------
  const handleImportExcel = async () => {
    if (!importFile) return;

    setImporting(true);
    try {
      const res = await importExcelAPI.upload(importFile);
      toast.success(res.message || t("sales.success.imported"));
      setImportFile(null);
      await loadAllData();
    } finally {
      setImporting(false);
    }
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    setSearching(true);
    try {
      const data =
        searchMode === "sku"
          ? await salesAPI.getSalesHistoryBySku(searchTerm)
          : await salesAPI.getSalesHistoryByName(searchTerm);

      setSearchResults(data);
      toast.success(t("sales.success.search"));
    } catch {
      toast.error(t("sales.errors.search"));
    } finally {
      setSearching(false);
    }
  };

  const displayedSales = searchResults
    ? sales.filter((s) =>
        s.items.some((it) =>
          searchMode === "sku"
            ? it.sku.includes(searchTerm)
            : it.productName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
      )
    : sales;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* LEFT PANEL */}
        <div className="lg:w-96 space-y-6">
          {/* CREATE SALE */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-blue-700 mb-6">
              {t("sales.create.title")}
            </h1>

            {items.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 mb-4 bg-blue-50"
              >
                <select
                  className="w-full mb-3 px-4 py-2 border rounded-lg"
                  value={item.productId}
                  onChange={(e) =>
                    updateItem(
                      index,
                      "productId",
                      Number(e.target.value)
                    )
                  }
                >
                  <option value={0}>
                    {t("sales.create.selectProduct")}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sku}) — ${p.price.toFixed(2)}
                    </option>
                  ))}
                </select>

                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    min={1}
                    className="flex-1 px-4 py-2 border rounded-lg"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                  />

                  {index > 0 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600"
                    >
                      <Trash2 />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full border-dashed border-2 py-2 rounded-lg text-blue-600 mb-4"
            >
              <Plus className="inline mr-2" />
              {t("sales.create.addItem")}
            </button>

            <div className="text-right font-bold mb-4">
              {t("common.total")}: ${totalPreview.toFixed(2)}
            </div>

            <button
              onClick={submitSale}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {saving ? t("common.saving") : t("sales.create.submit")}
            </button>
          </div>

          {/* IMPORT EXCEL */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="font-bold mb-3 flex items-center gap-2">
              <Upload /> {t("sales.import.title")}
            </h2>

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) =>
                setImportFile(e.target.files?.[0] ?? null)
              }
            />

            <button
              onClick={handleImportExcel}
              disabled={importing}
              className="mt-4 w-full bg-emerald-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {importing ? t("sales.import.importing") : t("sales.import.submit")}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 space-y-6">

          {/* SALE DETAILS — MOVED TO TOP */}
          <div>
            <h2 className="text-xl font-bold mb-3">
              {t("sales.details.title")}
            </h2>

            {!selectedSale ? (
              <p className="text-gray-500">
                {t("sales.details.select")}
              </p>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="flex justify-between px-6 py-4 bg-blue-50">
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        selectedSale.saleDate
                      ).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t("sales.details.id")} #{selectedSale.id}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-blue-700">
                    {t("common.total")}: $
                    {selectedSale.totalAmount.toFixed(2)}
                  </div>
                </div>

                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        {t("tables.product")}
                      </th>
                      <th className="px-6 py-3 text-left">
                        {t("tables.sku")}
                      </th>
                      <th className="px-6 py-3 text-center">
                        {t("tables.quantity")}
                      </th>
                      <th className="px-6 py-3 text-right">
                        {t("tables.unitPrice")}
                      </th>
                      <th className="px-6 py-3 text-right">
                        {t("tables.subtotal")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedSale.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4">
                          {item.productName}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-right">
                          ${item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-blue-700">
                          ${item.subtotal.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white p-4 rounded-xl shadow-sm flex gap-3">
            <select
              value={searchMode}
              onChange={(e) =>
                setSearchMode(e.target.value as "sku" | "name")
              }
              className="border rounded-lg px-3"
            >
              <option value="sku">{t("tables.sku")}</option>
              <option value="name">{t("tables.name")}</option>
            </select>

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("sales.search.placeholder")}
              className="flex-1 border rounded-lg px-4"
            />

            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-blue-600 text-white px-4 rounded-lg disabled:opacity-50"
            >
              {searching ? t("sales.search.searching") : <Search />}
            </button>
          </div>

          {/* RECENT SALES */}
          <div>
            <h2 className="text-xl font-bold mb-3">
              {t("sales.recent.title")}
            </h2>

            {loading ? (
              <p className="text-gray-500">
                {t("sales.recent.loading")}
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentSales.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSale(s)}
                    className={`bg-blue-50 rounded-xl p-4 shadow cursor-pointer
                      ${
                        selectedSale?.id === s.id
                          ? "ring-2 ring-blue-500 bg-blue-100"
                          : "hover:bg-blue-100"
                      }`}
                  >
                    <p className="font-semibold">
                      {s.items.length} {t("sales.recent.items")}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(s.saleDate).toLocaleString()}
                    </p>
                    <p className="text-xl font-bold text-blue-700 mt-2">
                      ${s.totalAmount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SALES HISTORY */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {loading ? (
              <p className="p-4 text-gray-500">
                {t("sales.history.loading")}
              </p>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      {t("tables.date")}
                    </th>
                    <th className="px-6 py-3 text-center">
                      {t("tables.items")}
                    </th>
                    <th className="px-6 py-3 text-right">
                      {t("common.total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {displayedSales.map((sale) => (
                    <tr
                      key={sale.id}
                      onClick={() => setSelectedSale(sale)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedSale?.id === sale.id
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        {new Date(
                          sale.saleDate
                        ).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.items.length}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-blue-700">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}