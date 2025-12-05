// src/pages/inventory/InventoryEdit.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/http";
import ProductForm from "./ProductForm";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

export default function InventoryEdit() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: item, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => api.get(`/api/v1/inventory/${id}`).then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.put(`/api/v1/inventory/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      queryClient.invalidateQueries(["inventory", id]);
      navigate("/inventory");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          {t("inventory_edit")}
        </h1>
      </div>

      <ProductForm
        initialData={item}
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        error={mutation.error?.message}
      />
    </div>
  );
}