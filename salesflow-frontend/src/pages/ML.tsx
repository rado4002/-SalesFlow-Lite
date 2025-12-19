// src/pages/ForecastAI.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Menu,
  Search,
  TrendingUp,
  AlertTriangle,
  Package,
  Brain,
  Cpu,
  Target,
  BarChart3,
  Sparkles,
  Activity,
  Zap,
  ChevronRight,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  Legend,
} from "recharts";
import { useTranslation } from "react-i18next";
import { mlAPI } from "../services/mlAPI";
import { productAPI } from "../services/productAPI";
import type { Product } from "../types/product";
import type {
  ForecastResult,
  AnomalyResponse,
  AnalyticsPeriod,
  ForecastScope,
} from "../types/ml";

export default function ForecastAI() {
  const { t } = useTranslation();

  // --------------------------------------------
  // UI STATE
  // --------------------------------------------
  const [mode, setMode] = useState<ForecastScope>("GLOBAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forecastDays, setForecastDays] = useState(14);
  const [period, setPeriod] = useState<AnalyticsPeriod>("daily");
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [products, setProducts] = useState<Product[]>([]);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyResponse | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [loadingAnomalies, setLoadingAnomalies] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------------
  // LOAD PRODUCTS
  // --------------------------------------------
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productAPI.getAll();
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --------------------------------------------
  // RUN FORECAST
  // --------------------------------------------
  const handleForecast = async () => {
    setError(null);
    setForecast(null);
    setLoadingForecast(true);

    if (mode === "PRODUCT" && !selectedProduct) {
      setError(t("forecast.errors.selectProduct"));
      setLoadingForecast(false);
      return;
    }

    try {
      const result = await mlAPI.forecastSales({
        scope: mode,
        sku: mode === "PRODUCT" ? selectedProduct!.sku : null,
        name: mode === "PRODUCT" && !selectedProduct!.sku ? selectedProduct!.name : null,
        product_id: mode === "PRODUCT" ? selectedProduct!.id : null,
        forecast_days: forecastDays,
        period,
      });

      setForecast(result);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Unknown error";
      setError(t("forecast.errors.forecastFailed", { error: msg }));
    } finally {
      setLoadingForecast(false);
    }
  };

  // --------------------------------------------
  // DETECT ANOMALIES
  // --------------------------------------------
  const handleAnomalies = async () => {
    setError(null);
    setAnomalies(null);
    setLoadingAnomalies(true);

    if (mode === "PRODUCT" && !selectedProduct) {
      setError(t("forecast.errors.selectProduct"));
      setLoadingAnomalies(false);
      return;
    }

    try {
      const result = await mlAPI.detectAnomalies({
        scope: mode,
        sku: mode === "PRODUCT" ? selectedProduct!.sku : null,
        name: mode === "PRODUCT" && !selectedProduct!.sku ? selectedProduct!.name : null,
        product_id: mode === "PRODUCT" ? selectedProduct!.id : null,
        period,
      });

      setAnomalies(result);
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Unknown error";
      setError(t("forecast.errors.anomalyFailed", { error: msg }));
    } finally {
      setLoadingAnomalies(false);
    }
  };

  // --------------------------------------------
  // CHART DATA
  // --------------------------------------------
  const chartData = forecast
    ? forecast.dates.map((date, i) => ({
        date,
        forecast: forecast.predictions[i],
        lower: forecast.predictions[i] * (1 - confidenceLevel / 100),
        upper: forecast.predictions[i] * (1 + confidenceLevel / 100),
      }))
    : [];

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                <Brain className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("forecast.header.title", "SalesFlow AI")}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-blue-50 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-200">
              <Calendar className="w-4 h-4" />
              {t("common.days30")}
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-10">
        {/* HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl opacity-50" />
          
          <div className="relative bg-white rounded-3xl p-10 border border-gray-200 shadow-xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {t("forecast.badge.aiAnalytics", "AI PREDICTIVE ANALYTICS")}
                  </span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-900 via-purple-800 to-blue-800 text-transparent bg-clip-text leading-tight">
                  {t("forecast.title", "AI Forecasting")}
                </h1>
                
                <p className="text-xl text-gray-600 mt-6 mb-10 max-w-2xl">
                  {t("forecast.subtitle", "Leverage machine learning to predict sales trends, detect anomalies, and optimize your inventory with precision.")}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleForecast}
                    disabled={loadingForecast}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-3 transition-all duration-200 disabled:opacity-70"
                  >
                    <Zap className="w-5 h-5" />
                    {loadingForecast
                      ? t("forecast.actions.forecasting", "Generating forecast...")
                      : t("forecast.actions.runForecast", "Run Forecast")}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAnomalies}
                    disabled={loadingAnomalies}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/30 flex items-center gap-3 transition-all duration-200 disabled:opacity-70"
                  >
                    <AlertTriangle className="w-5 h-5" />
                    {loadingAnomalies
                      ? t("forecast.actions.scanning", "Scanning for anomalies...")
                      : t("forecast.actions.detectAnomalies", "Detect Anomalies")}
                  </motion.button>
                </div>
              </div>
              
              <div className="lg:w-96">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>{t("forecast.capabilities.title", "AI Capabilities")}</span>
                    </div>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {t("forecast.capabilities.predictive", "Predictive Forecasting")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("forecast.capabilities.predictiveDesc", "ML algorithms for accurate sales predictions")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <Activity className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {t("forecast.capabilities.anomaly", "Anomaly Detection")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("forecast.capabilities.anomalyDesc", "Real-time detection of unusual patterns")}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                      <div className="flex items-start gap-3">
                        <BarChart3 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">
                            {t("forecast.capabilities.trend", "Trend Analysis")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("forecast.capabilities.trendDesc", "Identify seasonal patterns and trends")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* PARAMETERS SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {t("forecast.parameters.title", "Forecast Parameters")}
            </h2>
            <Brain className="w-8 h-8 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN - MODE & SEARCH */}
            <div>
              {/* MODE SELECTION */}
              <div className="mb-8">
                <div className="text-sm font-semibold text-gray-700 mb-4 items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{t("forecast.parameters.mode", "Forecast Scope")}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setMode("GLOBAL");
                      setSelectedProduct(null);
                      setSearchQuery("");
                    }}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                      mode === "GLOBAL"
                        ? "bg-blue-50 border-blue-500 text-blue-700 shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      mode === "GLOBAL" ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      <BarChart3 className={`w-6 h-6 ${mode === "GLOBAL" ? "text-blue-600" : "text-gray-500"}`} />
                    </div>
                    <span className="font-semibold">{t("forecast.mode.global", "Global Forecast")}</span>
                    <p className="text-sm text-center">{t("forecast.mode.globalDesc", "All products aggregated")}</p>
                  </button>
                  
                  <button
                    onClick={() => setMode("PRODUCT")}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 ${
                      mode === "PRODUCT"
                        ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      mode === "PRODUCT" ? "bg-purple-100" : "bg-gray-100"
                    }`}>
                      <Package className={`w-6 h-6 ${mode === "PRODUCT" ? "text-purple-600" : "text-gray-500"}`} />
                    </div>
                    <span className="font-semibold">{t("forecast.mode.product", "Product Forecast")}</span>
                    <p className="text-sm text-center">{t("forecast.mode.productDesc", "Specific product analysis")}</p>
                  </button>
                </div>
              </div>

              {/* PRODUCT SEARCH */}
              {mode === "PRODUCT" && (
                <div className="mb-8">
                  <div className="text-sm font-semibold text-gray-700 mb-3 items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      <span>{t("forecast.search.label", "Select Product")}</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("forecast.search.placeholder", "Search by name or SKU...")}
                      className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  
                  {searchQuery && filteredProducts.length > 0 && (
                    <div className="mt-3 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto z-10">
                      {filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedProduct(p);
                            setSearchQuery(`${p.sku} - ${p.name}`);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-semibold text-gray-900">{p.name}</p>
                          <p className="text-sm text-gray-500">
                            SKU: {p.sku} • {t("common.price", "Price")}: ${p.price}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {selectedProduct && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">{selectedProduct.name}</p>
                          <p className="text-sm text-gray-600">
                            {t("forecast.search.selected", "Selected for analysis")}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedProduct(null);
                            setSearchQuery("");
                          }}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          {t("forecast.search.clear", "Clear")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - SETTINGS */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("forecast.settings.days", "Forecast Period")}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={90}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={forecastDays}
                      onChange={(e) => setForecastDays(Number(e.target.value))}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                      {t("forecast.settings.daysUnit", "days")}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("forecast.settings.period", "Time Granularity")}
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
                  >
                    <option value="daily">{t("forecast.period.daily", "Daily")}</option>
                    <option value="weekly">{t("forecast.period.weekly", "Weekly")}</option>
                    <option value="monthly">{t("forecast.period.monthly", "Monthly")}</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("forecast.settings.confidenceLevel", "Confidence Level")}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="80"
                    max="99"
                    step="1"
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={confidenceLevel}
                    onChange={(e) => setConfidenceLevel(Number(e.target.value))}
                  />
                  <span className="text-xl font-bold text-blue-600 w-16">{confidenceLevel}%</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>{t("forecast.settings.confidenceLow", "Low (80%)")}</span>
                  <span>{t("forecast.settings.confidenceMedium", "Medium (90%)")}</span>
                  <span>{t("forecast.settings.confidenceHigh", "High (95%)")}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ERROR DISPLAY */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 text-red-700 font-medium flex items-center gap-4"
          >
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <div>
              <p className="font-bold">{t("forecast.errors.title", "Forecast Error")}</p>
              <p>{error}</p>
            </div>
          </motion.div>
        )}

        {/* FORECAST RESULTS */}
        {forecast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                  <TrendingUp className="w-12 h-12" />
                </div>
                <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                  {t("forecast.summary.total", "Total Forecast")}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {forecast.summary.total.toLocaleString()}
                </p>
                <p className="text-blue-100 text-sm mt-1">
                  {t("common.units", "units")}
                </p>
              </div>
              
              <div className="bg-purple-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                  <Activity className="w-12 h-12" />
                </div>
                <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">
                  {t("forecast.summary.dailyAverage", "Daily Average")}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {Math.round(forecast.summary.daily_average)}
                </p>
                <p className="text-purple-100 text-sm mt-1">
                  {t("common.unitsPerDay", "units/day")}
                </p>
              </div>
              
              <div className="bg-orange-500 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                  <Zap className="w-12 h-12" />
                </div>
                <p className="text-orange-100 text-sm font-medium uppercase tracking-wider">
                  {t("forecast.summary.peak", "Peak Day")}
                </p>
                <p className="text-3xl font-bold mt-2">
                  {forecast.summary.peak_value}
                </p>
                <p className="text-orange-100 text-sm mt-1">
                  {t("common.on", "on")} {forecast.summary.peak_day}
                </p>
              </div>
              
              <div className="bg-emerald-500 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles className="w-12 h-12" />
                </div>
                <TrendingUp className="w-8 h-8 mb-2" />
                <p className="text-emerald-100 text-sm font-medium uppercase tracking-wider">
                  {t("forecast.summary.trendDirection", "Trend Direction")}
                </p>
                <p className="text-2xl font-bold capitalize">
                  {forecast.summary.trend}
                </p>
                <p className="text-emerald-100 text-sm mt-1">
                  {forecast.summary.period_label}
                </p>
              </div>
            </div>

            {/* ENHANCED CHART */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t("forecast.chart.title", "Sales Forecast")}
                    {forecast.scope === "PRODUCT" && forecast.product && (
                      <span className="text-blue-600 ml-2">
                        - {forecast.product.name}
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-600">
                    {confidenceLevel}% {t("forecast.chart.confidenceInterval", "confidence interval")}
                  </p>
                </div>
                
                <div className="items-center gap-4 mt-4 lg:mt-0">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {t("forecast.chart.forecast", "Forecast")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-200 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {t("forecast.chart.confidence", "Confidence Interval")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.1} />
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
                        if (name === 'forecast') return [`${value} ${t("common.units", "units")}`, t("forecast.chart.forecast", "Forecast")];
                        if (name === 'lower') return [`${value} ${t("common.units", "units")}`, t("forecast.chart.lowerBound", "Lower Bound")];
                        if (name === 'upper') return [`${value} ${t("common.units", "units")}`, t("forecast.chart.upperBound", "Upper Bound")];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="#93c5fd"
                      strokeWidth={1}
                      fill="url(#confidenceGradient)"
                      dot={false}
                      name={t("forecast.chart.upperBound", "Upper Bound")}
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="#93c5fd"
                      strokeWidth={1}
                      fill="#ffffff"
                      dot={false}
                      name={t("forecast.chart.lowerBound", "Lower Bound")}
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                      name={t("forecast.chart.forecast", "Forecast")}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* ANOMALIES RESULTS */}
        {anomalies && anomalies.count > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {t("forecast.anomalies.title", "Anomalies Detected")}
                    </h2>
                    <p className="text-gray-600">
                      {anomalies.count} {t("forecast.anomalies.patterns", "unusual patterns identified")}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 bg-red-600 text-white rounded-full font-bold">
                  {anomalies.count} {t("forecast.anomalies.alerts", "Alerts")}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {anomalies.anomalies.map((anom, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${
                      anom.severity === "high"
                        ? "bg-red-50 border-red-300"
                        : "bg-orange-50 border-orange-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                          anom.severity === "high" ? "bg-red-100" : "bg-orange-100"
                        }`}>
                          <AlertTriangle className={`w-6 h-6 ${
                            anom.severity === "high" ? "text-red-600" : "text-orange-600"
                          }`} />
                        </div>
                        <p className="text-lg font-bold text-gray-800">{anom.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        anom.severity === "high"
                          ? "bg-red-200 text-red-800"
                          : "bg-orange-200 text-orange-800"
                      }`}>
                        {t(`forecast.anomalies.severity.${anom.severity.toLowerCase()}`, anom.severity.toUpperCase())}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("forecast.anomalies.value", "Value:")}</span>
                        <span className="font-bold text-gray-900">{anom.value}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("forecast.anomalies.zscore", "Z-Score:")}</span>
                        <span className={`font-bold ${
                          anom.score > 3 ? "text-red-600" : "text-orange-600"
                        }`}>
                          {anom.score.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{t("forecast.anomalies.type", "Type:")}</span>
                        <span className="font-bold text-gray-900 capitalize">{anom.type}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700 italic">{anom.explanation}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* NO ANOMALIES FOUND */}
        {anomalies && anomalies.count === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800">
              {t("forecast.anomalies.none.title", "No Anomalies Detected")}
            </h3>
            <p className="text-emerald-700 mt-2 max-w-md mx-auto">
              {t("forecast.anomalies.none.subtitle", "Your sales patterns appear normal and predictable. Continue monitoring for optimal performance.")}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}