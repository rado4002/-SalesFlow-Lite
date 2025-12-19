// src/pages/Analytics.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Package,
  User,
  Menu,
  TrendingUp,
  DollarSign,
  Package as PackageIcon,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  Download,
  Filter,
  CreditCard,
  ShoppingBag,
  Box,
  LineChart,
  Trophy,
  Award,
  Star,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";

import { analyticsAPI } from "../services/analyticsAPI";
import ReportsExport from "../components/analytics/ReportsExport";
import type {
  SalesAnalyticsResponse,
  StockAnalyticsResponse,
  AnalyticsPeriod,
} from "../types/analytics";

/* -----------------------------------------------------
   Helpers
----------------------------------------------------- */
function stockStyle(status: string) {
  switch (status) {
    case "OUT_OF_STOCK":
      return {
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "bg-red-600 text-white",
        icon: <AlertTriangle className="w-5 h-5" />,
        trend: "down",
      };
    case "LOW_STOCK":
      return {
        bg: "bg-orange-50",
        border: "border-orange-200",
        badge: "bg-orange-500 text-white",
        icon: <AlertTriangle className="w-5 h-5" />,
        trend: "warning",
      };
    case "DEAD_STOCK":
      return {
        bg: "bg-gray-100",
        border: "border-gray-300",
        badge: "bg-gray-600 text-white",
        icon: <PackageIcon className="w-5 h-5" />,
        trend: "critical",
      };
    default:
      return {
        bg: "bg-green-50",
        border: "border-green-200",
        badge: "bg-green-600 text-white",
        icon: <Package className="w-5 h-5" />,
        trend: "up",
      };
  }
}

/* -----------------------------------------------------
   Page
----------------------------------------------------- */
export default function Analytics() {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<AnalyticsPeriod>("daily");
  const [sales, setSales] = useState<SalesAnalyticsResponse | null>(null);
  const [stock, setStock] = useState<StockAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [s, st] = await Promise.all([
        analyticsAPI.getSalesAnalytics(period),
        analyticsAPI.getStockAnalytics(period),
      ]);
      setSales(s);
      setStock(st);
    } catch (e) {
      console.error("Analytics error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [period]);

  if (loading || !sales || !stock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#eff6ff] via-[#ecfeff] to-[#eef2ff]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600" />
          <p className="mt-6 text-xl text-gray-600">
            {t("analytics.loading")}
          </p>
        </div>
      </div>
    );
  }

  const k = sales.kpis;
  const sk = stock.kpis;

  // Données enrichies pour les graphiques
  const enrichedDailyData = sales.daily.map((day, index) => ({
    ...day,
    movingAverage: index > 0 
      ? (day.total_revenue + sales.daily[Math.max(0, index - 1)].total_revenue + sales.daily[Math.min(sales.daily.length - 1, index + 1)].total_revenue) / 3
      : day.total_revenue,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eff6ff] via-[#ecfeff] to-[#eef2ff]">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SalesFlow Analytics</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-blue-50 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-200">
                <Calendar className="w-4 h-4" />
                {sales.period_label}
              </div>
              <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-10">
        {/* SALES KPI — SOLID COLOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            icon={<CreditCard className="w-8 h-8" />}
            title={t("analytics.kpi.totalRevenue")}
            value={`$${k.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="blue"
          />
          <KPICard
            icon={<ShoppingBag className="w-8 h-8" />}
            title={t("analytics.kpi.transactions")}
            value={k.total_transactions.toLocaleString()}
            color="purple"
          />
          <KPICard
            icon={<Box className="w-8 h-8" />}
            title={t("analytics.kpi.unitsSold")}
            value={k.total_quantity.toLocaleString()}
            color="orange"
          />
          <KPICard
            icon={<LineChart className="w-8 h-8" />}
            title={t("analytics.kpi.averageTicket")}
            value={`$${k.average_ticket.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            color="green"
          />
        </div>

        {/* STOCK KPI — COMPACT & ELEGANT */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <KPICardSmall 
            title={t("analytics.stock.stockValue")} 
            value={`$${sk.total_stock_value.toLocaleString()}`} 
            icon={<DollarSign className="w-8 h-8" />}
            trend="up"
          />
          <KPICardSmall 
            title={t("analytics.stock.outOfStock")} 
            value={sk.out_of_stock_count.toString()} 
            icon={<AlertTriangle className="w-8 h-8" />}
            trend="critical"
          />
          <KPICardSmall 
            title={t("analytics.stock.lowStock")} 
            value={sk.low_stock_count.toString()} 
            icon={<AlertTriangle className="w-8 h-8" />}
            trend="warning"
          />
          <KPICardSmall 
            title={t("analytics.stock.urgentReorder")} 
            value={sk.urgent_reorder_count.toString()} 
            icon={<AlertTriangle className="w-8 h-8 text-red-500" />}
            trend="alert"
          />
          <KPICardSmall 
            title={t("analytics.stock.deadStock")} 
            value={sk.dead_stock_count.toString()} 
            icon={<PackageIcon className="w-8 h-8" />}
            trend="down"
          />
          <KPICardSmall 
            title={t("analytics.stock.lowStockRatio")} 
            value={`${sk.low_stock_ratio}%`} 
            icon={<TrendingDown className="w-8 h-8" />}
            trend="down"
          />
        </div>

        {/* SALES TREND + TOP PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SALES TREND — ENHANCED AREA CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("analytics.salesTrends")}
                </h2>
                <p className="text-gray-600">Revenue trends over time</p>
              </div>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
                className="px-5 py-3 bg-blue-50 rounded-xl text-sm font-medium border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">{t("period.today")}</option>
                <option value="weekly">{t("period.last7Days")}</option>
                <option value="monthly">{t("period.thisMonth")}</option>
                <option value="quarterly">{t("period.last90Days")}</option>
              </select>
            </div>

            {sales.daily.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <TrendingUp className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-lg font-medium">
                  {t("analytics.noSalesData")}
                </p>
              </div>
            ) : (
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enrichedDailyData}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                        <stop offset="50%" stopColor="#60a5fa" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        padding: "12px",
                      }}
                      formatter={(value, name) => {
                        if (name === 'total_revenue') {
                          return [`$${Number(value).toLocaleString()}`, 'Revenue'];
                        }
                        if (name === 'movingAverage') {
                          return [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 'Moving Avg'];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total_revenue"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                      dot={{ fill: "#2563eb", r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="movingAverage"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fill="url(#averageGradient)"
                      dot={false}
                      name="Moving Average"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* TOP PRODUCTS — CARTE AVEC CLASSEMENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("analytics.topProducts")}
                </h2>
                <p className="text-gray-600">Top 5 performing products</p>
              </div>
              <Trophy className="w-8 h-8 text-orange-500" />
            </div>

            {k.top_products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <PackageIcon className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                <p className="text-lg font-medium">
                  {t("analytics.noProductSales")}
                </p>
              </div>
            ) : (
              <div className="space-y-6 h-96 overflow-y-auto pr-2">
                {/* HEADER DU CLASSEMENT */}
                <div className="flex items-center justify-between mb-6 p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <Award className="w-6 h-6 text-orange-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">Product Ranking</h3>
                      <p className="text-sm text-gray-600">Based on total revenue</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold text-orange-600">${k.total_revenue.toLocaleString()}</span>
                  </div>
                </div>

                {/* LISTE DES PRODUITS CLASSÉS */}
                {k.top_products.slice(0, 5).map((product, index) => {
                  const isFirst = index === 0;
                  const isSecond = index === 1;
                  const isThird = index === 2;
                  
                  return (
                    <motion.div
                      key={product.product_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-6 rounded-2xl border-2 ${isFirst ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-200'} hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {/* BADGE DE RANG */}
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl
                            ${isFirst ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-lg' : ''}
                            ${isSecond ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' : ''}
                            ${isThird ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' : ''}
                            ${index > 2 ? 'bg-gray-300 text-gray-700' : ''}
                          `}>
                            {isFirst ? <Trophy className="w-6 h-6" /> : 
                             isSecond ? <Star className="w-6 h-6" /> :
                             isThird ? <Star className="w-5 h-5" /> :
                             <span className="text-lg">{index + 1}</span>}
                          </div>

                          {/* INFO PRODUIT */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900">{product.name}</h4>
                              {isFirst && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
                                  BEST SELLER
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">ID:</span>
                                <span className="bg-white px-2 py-1 rounded">{product.product_id}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* REVENUE */}
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ${product.revenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                      </div>

                      {/* STATS DÉTAILLÉES */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <PackageIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Units</span>
                          </div>
                          <div className="text-xl font-bold text-gray-900">
                            {product.total_quantity.toLocaleString()}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <TrendingUpIcon className="w-4 h-4 text-emerald-600" />
                            <span className="text-sm font-medium text-gray-700">Share</span>
                          </div>
                          <div className="text-xl font-bold text-emerald-700">
                            {product.share_of_revenue.toFixed(1)}%
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Rank</span>
                          </div>
                          <div className="text-xl font-bold text-purple-700">
                            #{index + 1}
                          </div>
                        </div>
                      </div>

                      {/* BARRE DE PROGRESSION */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Performance vs Top 1</span>
                          <span className="text-sm font-bold text-orange-600">
                            {Math.round((product.revenue / k.top_products[0].revenue) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${isFirst ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-orange-400 to-amber-400'}`}
                            style={{
                              width: `${(product.revenue / k.top_products[0].revenue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* STATS DU CLASSEMENT */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Products in Ranking:</span>
                      <span className="ml-2 font-bold text-gray-900">{k.top_products.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Avg Revenue per Product:</span>
                      <span className="ml-2 font-bold text-gray-900">
                        ${(k.top_products.reduce((sum, p) => sum + p.revenue, 0) / k.top_products.length).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Top Product Share:</span>
                      <span className="ml-2 font-bold text-orange-600">
                        {k.top_products[0]?.share_of_revenue?.toFixed(1) || '0'}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Units Sold:</span>
                      <span className="ml-2 font-bold text-gray-900">
                        {k.top_products.reduce((sum, p) => sum + p.total_quantity, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* STOCK ALERTS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {t("analytics.stockAlerts")}
            </h2>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
          
          {stock.critical_products.length === 0 ? (
            <div className="text-center py-16 text-emerald-600">
              <Package className="w-20 h-20 mx-auto mb-6" />
              <p className="text-xl font-semibold">
                {t("analytics.stockHealthy")}
              </p>
              <p className="text-sm text-emerald-600 mt-2">
                {t("analytics.stockPraise")}
              </p>
            </div>
          ) : (
            <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
              {stock.critical_products.map((p) => {
                const s = stockStyle(p.status);
                return (
                  <div
                    key={p.product_id}
                    className={`p-6 rounded-2xl border-2 ${s.bg} ${s.border} transition-all hover:shadow-md`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-lg font-bold text-gray-900">{p.name}</p>
                        <p className="text-sm text-gray-600">ID: {p.product_id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-blue-600">
                          {s.icon}
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${s.badge}`}>
                          {p.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>{t("analytics.labels.currentStock")}:</strong> {p.current_stock}</div>
                      <div><strong>{t("analytics.labels.minStock")}:</strong> {p.min_stock}</div>
                      <div><strong>{t("analytics.labels.price")}:</strong> ${Number(p.unit_price).toFixed(2)}</div>
                      <div><strong>{t("analytics.labels.value")}:</strong> ${Number(p.stock_value).toFixed(2)}</div>
                      <div><strong>{t("analytics.labels.lastSale")}:</strong> {p.last_sale_date || "—"}</div>
                      <div>
                        <strong>{t("analytics.labels.coverage")}:</strong>{" "}
                        {p.coverage_days == null ? "—" : `${p.coverage_days.toFixed(1)} days`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* REPORT EXPORT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-16"
        >
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl border border-blue-200 px-12 py-10 flex flex-col items-center gap-6 max-w-2xl text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Download className="w-12 h-12 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {t("analytics.export.title")}
              </h3>
              <p className="text-gray-600 mt-3 max-w-md">
                {t("analytics.export.description")}
              </p>
            </div>
            <ReportsExport />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------
   Enhanced KPI Components
----------------------------------------------------- */
function KPICard({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: "blue" | "purple" | "orange" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    orange: "bg-orange-500",
    green: "bg-emerald-500",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`${colorClasses[color]} text-white rounded-2xl shadow-lg p-8 relative overflow-hidden`}
    >
      <div className="absolute top-4 right-4 opacity-10">
        {icon}
      </div>
      <div className="flex items-center justify-between">
        <div className="relative z-10">
          <p className="text-white/90 text-sm font-medium uppercase tracking-wider">{title}</p>
          <p className="text-4xl font-bold mt-4">{value}</p>
        </div>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function KPICardSmall({ title, value, icon, trend }: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  trend?: string;
}) {
  const trendColor = {
    up: "text-green-600 bg-green-100",
    down: "text-red-600 bg-red-100",
    warning: "text-yellow-600 bg-yellow-100",
    alert: "text-orange-600 bg-orange-100",
    critical: "text-red-600 bg-red-100",
  }[trend || "up"];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-2">{title}</p>
      {trend && (
        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-3 ${trendColor}`}>
          {trend === 'up' && <TrendingUp className="w-3 h-3" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3" />}
          {trend && ['warning', 'alert', 'critical'].includes(trend) && <AlertTriangle className="w-3 h-3" />}
          <span className="capitalize">{trend}</span>
        </div>
      )}
    </div>
  );
}