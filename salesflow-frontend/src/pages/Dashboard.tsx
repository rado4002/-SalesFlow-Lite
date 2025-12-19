import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { Variants } from 'framer-motion';
import {
  TrendingUp,
  Package,
  FileText,
  Bot,
  Upload,
  Plus,
  BarChart3,
  Sparkles,
  Target,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Activity,
  Database,
  Cpu,
} from "lucide-react";
import { useState, useEffect } from "react";

/* ================= ANIMATIONS ================= */
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.4, 
      ease: "easeOut" 
    } 
  },
};

const hoverLift = {
  whileHover: { y: -6, scale: 1.02, transition: { duration: 0.2 } },
  whileTap: { scale: 0.98 },
};

const pulse = {
  animate: {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
    },
  },
};

/* ================= DASHBOARD ================= */
const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userName, setUserName] = useState("developer");

  // Simuler la récupération du nom de l'utilisateur connecté
  useEffect(() => {
    // Dans un cas réel, vous récupéreriez cela depuis votre auth context
    const user = localStorage.getItem("user") || "admin";
    setUserName(user.charAt(0).toUpperCase() + user.slice(1));
  }, []);

  const stats = [
    { 
      value: "98%", 
      label: t("home.stats.forecastAccuracy", "Forecast Accuracy"), 
      icon: <Target className="w-5 h-5" /> 
    },
    { 
      value: "24/7", 
      label: t("home.stats.activeMonitoring", "Active Monitoring"), 
      icon: <Clock className="w-5 h-5" /> 
    },
    { 
      value: "+32%", 
      label: t("home.stats.salesGrowth", "Sales Growth"), 
      icon: <TrendingUp className="w-5 h-5" /> 
    },
    { 
      value: "99.9%", 
      label: t("home.stats.stockAvailability", "Stock Availability"), 
      icon: <Package className="w-5 h-5" /> 
    },
  ];

  const goalFeatures = {
    sales: [
      t("home.goalFeatures.realTimeAnalytics", "Real-time analytics"),
      t("home.goalFeatures.trendDetection", "Trend detection"),
      t("home.goalFeatures.performanceMetrics", "Performance metrics")
    ],
    inventory: [
      t("home.goalFeatures.stockAlerts", "Stock alerts"),
      t("home.goalFeatures.replenishment", "Replenishment"),
      t("home.goalFeatures.deadStockAnalysis", "Dead stock analysis")
    ],
    reports: [
      t("home.goalFeatures.customTemplates", "Custom templates"),
      t("home.goalFeatures.autoScheduling", "Auto-scheduling"),
      t("home.goalFeatures.multiFormat", "Multi-format")
    ],
    forecast: [
      t("home.goalFeatures.mlPredictions", "ML predictions"),
      t("home.goalFeatures.anomalyDetection", "Anomaly detection"),
      t("home.goalFeatures.smartAlerts", "Smart alerts")
    ]
  };

  const proFeatures = [
    t("home.proFeatures.realTimeML", "Real-time ML models"),
    t("home.proFeatures.customAlgorithms", "Custom algorithms"),
    t("home.proFeatures.prioritySupport", "Priority support"),
    t("home.proFeatures.advancedAnalytics", "Advanced analytics")
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24"
      >
        {/* ================= HERO SECTION ================= */}
        <motion.div variants={item} className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-blue-600/5 rounded-3xl blur-3xl opacity-50" />
          
          <div className="relative bg-white rounded-3xl p-8 sm:p-14 border border-gray-200 shadow-xl shadow-blue-500/5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {t("home.badge", "BUSINESS INTELLIGENCE")}
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t("home.greeting", "Welcome back,")} <span className="text-blue-600">{userName}</span>
                  <span className="block text-gray-700 text-3xl sm:text-4xl lg:text-5xl mt-2">
                    {t("home.smartDashboard", "Smart Dashboard")}
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mt-6 mb-10 max-w-2xl">
                  {t("home.question", "Everything you need to scale your business. Real-time insights, AI predictions, and automation tools at your fingertips.")}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    {...hoverLift}
                    onClick={() => navigate("/analytics")}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-colors duration-200"
                  >
                    <BarChart3 className="w-5 h-5" />
                    {t("home.launchDashboard", "Launch Dashboard")}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    {...hoverLift}
                    onClick={() => navigate("/ml")}
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border-2 border-blue-200 shadow-lg shadow-blue-500/10 flex items-center gap-3 hover:border-blue-300 transition-colors duration-200"
                  >
                    <Sparkles className="w-5 h-5" />
                    {t("home.tryAI", "Try AI Features")}
                  </motion.button>
                </div>
              </div>
              
              <div className="lg:w-96">
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    {t("home.performance", "Performance Highlights")}
                  </h3>
                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors duration-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {stat.icon}
                          </div>
                          <span className="font-medium text-gray-700">{stat.label}</span>
                        </div>
                        <span className="text-xl font-bold text-blue-700">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ================= BUSINESS GOALS ================= */}
        <motion.div variants={item}>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.businessGoals", "Business Intelligence Goals")}
            </h2>
            <p className="text-gray-600">
              {t("home.goalsDesc", "Select your focus area to get personalized insights and recommendations")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <GoalCard
              title={t("home.increaseSales", "Increase Sales")}
              description={t("home.increaseSalesDesc", "Analyze and track sales performance")}
              gradient="from-blue-500 to-blue-600"
              icon={<TrendingUp size={32} />}
              features={goalFeatures.sales}
              onClick={() => navigate("/sales")}
              delay={0}
            />

            <GoalCard
              title={t("home.reduceStock", "Optimize Inventory")}
              description={t("home.reduceStockDesc", "Monitor inventory and avoid stockouts")}
              gradient="from-emerald-500 to-emerald-600"
              icon={<Package size={32} />}
              features={goalFeatures.inventory}
              onClick={() => navigate("/inventory")}
              delay={0.1}
            />

            <GoalCard
              title={t("home.prepareReport", "Advanced Reports")}
              description={t("home.prepareReportDesc", "Generate PDF & Excel management reports")}
              gradient="from-purple-500 to-purple-600"
              icon={<FileText size={32} />}
              features={goalFeatures.reports}
              onClick={() => navigate("/analytics")}
              delay={0.2}
            />

            <GoalCard
              title={t("home.forecast", "AI Forecasting")}
              description={t("home.forecastDesc", "Predict sales and optimize stock")}
              gradient="from-orange-500 to-orange-600"
              icon={<Bot size={32} />}
              features={goalFeatures.forecast}
              onClick={() => navigate("/ml")}
              delay={0.3}
            />
          </div>
        </motion.div>

        {/* ================= QUICK ACTIONS ================= */}
        <motion.div variants={item}>
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("home.quickStart", "Quick Start")}
            </h2>
            <p className="text-gray-600">
              {t("home.quickDesc", "Get started instantly with these powerful features")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickAction
              title={t("home.importExcel", "Import Data")}
              description={t("home.importExcelDesc", "Import your sales data from Excel or CSV")}
              icon={<Upload size={24} />}
              color="from-blue-500 to-blue-600"
              count={t("home.quickTimes.5min", "5 min")}
              onClick={() => navigate("/excel-upload")}
            />

            <QuickAction
              title={t("home.addProduct", "Catalog Management")}
              description={t("home.addProductDesc", "Add, edit, and manage your product catalog")}
              icon={<Plus size={24} />}
              color="from-emerald-500 to-emerald-600"
              count={t("home.quickTimes.2min", "2 min")}
              onClick={() => navigate("/products")}
            />

            <QuickAction
              title={t("home.viewAnalytics", "Live Analytics")}
              description={t("home.viewAnalyticsDesc", "Real-time insights and visualizations")}
              icon={<BarChart3 size={24} />}
              color="from-purple-500 to-purple-600"
              count={t("home.quickTimes.instant", "Instant")}
              onClick={() => navigate("/analytics")}
            />
          </div>
        </motion.div>

        {/* ================= AI CAPABILITIES ================= */}
        <motion.div variants={item}>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 sm:p-12 border border-blue-100 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
              <div className="lg:w-2/3">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-full mb-6">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {t("home.aiBadge", "POWERED BY ARTIFICIAL INTELLIGENCE")}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t("home.aiTitle", "AI Capabilities")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {t("home.aiFeatures.salesTracking", "Sales Tracking")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("home.aiFeatures.salesTrackingDesc", "Real-time monitoring and analysis of sales performance metrics")}
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                      <Package className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {t("home.aiFeatures.stockMonitoring", "Stock Monitoring")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("home.aiFeatures.stockMonitoringDesc", "Automated inventory tracking with predictive stock alerts")}
                    </p>
                  </div>
                  
                  <div className="flex flex-col p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-200 transition-colors duration-200">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                      <Database className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      {t("home.aiFeatures.dataPersistence", "Data Persistence")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t("home.aiFeatures.dataPersistenceDesc", "Secure and reliable data storage with automatic backups")}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/3">
                <motion.div
                  animate="animate"
                  variants={pulse}
                  className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-500/30"
                >
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    {t("home.proFeatures.title", "Pro Features Active")}
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {proFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <motion.button
                    {...hoverLift}
                    onClick={() => navigate("/ml")}
                    className="w-full py-3 bg-white text-blue-700 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <Sparkles className="w-5 h-5" />
                    {t("home.exploreAI", "Explore AI Features")}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

/* ================= UI COMPONENTS ================= */

interface GoalCardProps {
  title: string;
  description: string;
  gradient: string;
  icon: React.ReactNode;
  features: string[];
  onClick: () => void;
  delay: number;
}

const GoalCard = ({ title, description, gradient, icon, features, onClick, delay }: GoalCardProps) => (
  <motion.div
    initial="hidden"
    animate="show"
    transition={{ delay }}
  >
    <motion.button
      {...hoverLift}
      onClick={onClick}
      className={`
        relative w-full h-full
        bg-gradient-to-br ${gradient}
        text-white rounded-2xl p-8 text-left
        shadow-xl
        flex flex-col justify-between
        overflow-hidden
      `}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
      </div>
      
      <div className="relative z-10">
        <div className="mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-sm opacity-90 leading-relaxed mb-6">{description}</p>
        </div>
        
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 text-sm opacity-90">
              <CheckCircle className="w-4 h-4" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
          <span className="text-sm font-medium opacity-90">
            {useTranslation().t("common.explore", "Explore")}
          </span>
          <ArrowRight className="w-5 h-5 opacity-90" />
        </div>
      </div>
    </motion.button>
  </motion.div>
);

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count: string;
  onClick: () => void;
}

const QuickAction = ({ title, description, icon, color, count, onClick }: QuickActionProps) => {
  const { t } = useTranslation();
  
  return (
    <motion.button
      {...hoverLift}
      onClick={onClick}
      className="
        relative group
        bg-white rounded-2xl p-8 text-left
        border border-gray-200
        shadow-lg
        hover:shadow-xl hover:border-blue-200
        transition-all duration-300
      "
    >
      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className={`w-14 h-14 bg-gradient-to-br ${color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
          {icon}
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            {count}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        
        <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors duration-200">
          <span>{t("common.startNow", "Start Now")}</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </motion.button>
  );
};