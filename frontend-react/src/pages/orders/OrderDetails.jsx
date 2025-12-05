// src/pages/orders/OrderDetails.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/http";
import { useTranslation } from "react-i18next";
import { Package, User, Clock, CheckCircle, XCircle, ArrowLeft, Check } from "lucide-react";

export default function OrderDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => api.get(`/api/v1/orders/${id}`).then(res => res.data),
  });

  const completeMutation = useMutation({
    mutationFn: () => api.patch(`/api/v1/orders/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders", id]);
      queryClient.invalidateQueries(["orders"]);
      queryClient.invalidateQueries(["inventory"]);
    },
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock size={18} className="text-yellow-600" />;
      case "COMPLETED": return <CheckCircle size={18} className="text-green-600" />;
      case "CANCELLED": return <XCircle size={18} className="text-red-600" />;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            {t("order_details")}
          </h1>
          <div className="w-10" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={28} className="text-indigo-600" />
            <div>
              <h2 className="text-xl font-bold">#{order.id}</h2>
              <p className="text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
            {getStatusIcon(order.status)}
            {t(`order_status_${order.status.toLowerCase()}`)}
          </span>
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <User size={20} className="text-indigo-600" />
          <h3 className="font-semibold text-lg">{t("customer")}</h3>
        </div>
        <p className="text-slate-700 dark:text-slate-300">{order.customerName}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-lg mb-4">{t("order_items")} ({order.items.length})</h3>
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {item.price} USD × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-indigo-600">
                {(item.price * item.quantity).toFixed(2)} USD
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>{t("total")}</span>
            <span className="text-indigo-600">{order.total.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* ACTION */}
      {order.status === "PENDING" && (
        <div className="flex gap-3">
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 transition"
          >
            {completeMutation.isPending ? (
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Check size={20} />
            )}
            {t("complete_order")}
          </button>
        </div>
      )}
    </div>
  );
}