// src/pages/orders/OrderCreate.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/http";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Plus, Trash2, Search } from "lucide-react";

export default function OrderCreate() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const { data: inventory = [] } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.get("/api/v1/inventory").then(res => res.data),
  });

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) && item.quantity > 0
  );

  const addItem = () => {
    if (!selectedItem || items.find(i => i.id === selectedItem.id)) return;
    setItems([...items, { ...selectedItem, qty: 1 }]);
    setSelectedItem(null);
    setSearch("");
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setItems(items.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const mutation = useMutation({
    mutationFn: () => api.post("/api/v1/orders", {
      customerName,
      items: items.map(i => ({ inventoryId: i.id, quantity: i.qty })),
      total
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      navigate("/orders");
    },
  });

  const canSubmit = customerName && items.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          {t("new_order")}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t("create_order_subtitle")}
        </p>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <label className="block text-sm font-medium mb-2">{t("customer_name")}</label>
        <input
          type="text"
          value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          placeholder={t("customer_placeholder")}
          className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ADD ITEM */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-semibold text-lg">{t("add_items")}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={t("search_inventory")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-neutral-800 rounded-xl border"
          />
        </div>

        {search && filteredInventory.length > 0 && (
          <div className="max-h-48 overflow-y-auto border rounded-xl">
            {filteredInventory.map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 border-b last:border-0"
              >
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span className="text-sm text-slate-500">{item.quantity} {t("in_stock")}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedItem && (
          <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
            <Package size={20} className="text-indigo-600" />
            <div className="flex-1">
              <p className="font-medium">{selectedItem.name}</p>
              <p className="text-sm text-slate-600">{selectedItem.price} USD</p>
            </div>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* CART */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">{t("order_items")} ({items.length})</h3>
        {items.length === 0 ? (
          <p className="text-center text-slate-500 py-8">{t("cart_empty")}</p>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.price} USD × {item.qty}</p>
                </div>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={item.qty}
                  onChange={e => updateQty(item.id, parseInt(e.target.value))}
                  className="w-20 px-2 py-1 border rounded"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span className="text-indigo-600">{total.toFixed(2)} USD</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => mutation.mutate()}
          disabled={!canSubmit || mutation.isPending}
          className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {mutation.isPending ? t("creating") : t("create_order")}
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}