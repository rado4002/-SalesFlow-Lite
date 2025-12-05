// src/pages/inventory/InventoryAdd.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../api/http";
import ProductForm from "./ProductForm";
import { useTranslation } from "react-i18next";

export default function InventoryAdd() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/api/v1/inventory", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["inventory"]);
      navigate("/inventory");
    },
    onError: (error) => {
      console.error("Add failed:", error);
    },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
        {t("inventory_add")}
      </h1>
      <ProductForm
        onSubmit={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending}
        error={mutation.error?.message}
      />
    </div>
  );
}