// src/pages/inventory/ProductForm.jsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";

const schema = z.object({
  name: z.string().min(1, { message: "name_required" }),
  sku: z.string().min(1, { message: "sku_required" }),
  price: z.number().min(0, { message: "price_min" }),
  quantity: z.number().min(0, { message: "quantity_min" }),
  lowStockThreshold: z.number().min(0, { message: "threshold_min" }),
});

export default function ProductForm({ onSubmit, isLoading, error, initialData }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      price: 0,
      quantity: 0,
      lowStockThreshold: 5,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t("name")}
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={t("name_placeholder")}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{t(errors.name.message)}</p>
        )}
      </div>

      {/* SKU & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("sku")}
          </label>
          <input
            {...register("sku")}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500"
            placeholder={t("sku_placeholder")}
          />
          {errors.sku && (
            <p className="mt-1 text-sm text-red-600">{t(errors.sku.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("price")}
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{t(errors.price.message)}</p>
          )}
        </div>
      </div>

      {/* Quantity & Threshold */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("quantity")}
          </label>
          <input
            {...register("quantity", { valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500"
            placeholder="0"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{t(errors.quantity.message)}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("low_stock_threshold")}
          </label>
          <input
            {...register("lowStockThreshold", { valueAsNumber: true })}
            type="number"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-500"
            placeholder="5"
          />
          {errors.lowStockThreshold && (
            <p className="mt-1 text-sm text-red-600">
              {t(errors.lowStockThreshold.message)}
            </p>
          )}
        </div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? t("saving") : t("save_item")}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 dark:border-neutral-700 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
}