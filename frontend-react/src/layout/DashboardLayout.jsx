// src/layout/DashboardLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PageHeader from "../components/PageHeader";
import SyncStatusWidget from "../components/SyncStatusWidget";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  // Load saved language
  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (lang) i18n.changeLanguage(lang);
  }, [i18n]);

  // language handler
  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", e.target.value);
  };

  // Title resolver (keeps your existing mapping logic)
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/dashboard") return t("dashboard");
    if (p.startsWith("/inventory")) {
      if (p === "/inventory") return t("inventory");
      if (p.includes("/add")) return t("inventory_add") || "Add inventory";
      if (p.includes("/edit")) return t("inventory_edit") || "Edit inventory";
      return t("inventory");
    }
    if (p.startsWith("/orders")) return t("orders");
    if (p === "/customers") return t("customers");
    if (p === "/analytics") return t("analytics");
    if (p === "/settings") return t("settings");
    if (p === "/admin/diagnostics") return t("admin_diagnostics");
    return t("dashboard");
  };

  const title = getPageTitle();
  const subtitle =
    user ? `${user.username} • ${t(`roles.${user.role}`)} • ${user.organization || "My Shop"}` : "";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-slate-900 dark:text-slate-100">
      <div className="flex">
        {/* Left: Sidebar (keeps width & behavior internal) */}
        <Sidebar />

        {/* Right: Main area */}
        <div className="flex-1 min-h-screen flex flex-col">
          {/* Topbar (not fixed) */}
          <div className="w-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="py-4">
                <Topbar title={title} subtitle={subtitle} />
              </div>
            </div>
          </div>

          {/* Language bar (small) */}
          <div className="w-full bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-100 dark:border-neutral-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex justify-end">
              <select
                value={i18n.language}
                onChange={handleLangChange}
                className="text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md px-3 py-1 focus:outline-none"
                aria-label="Change language"
              >
                <option value="en">EN</option>
                <option value="fr">FR</option>
                <option value="sw">SW</option>
                <option value="ln">LN</option>
                <option value="zh">中文</option>
              </select>
            </div>
          </div>

          {/* Page header */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
            <PageHeader title={title} subtitle={subtitle} />
          </div>

          {/* Main content */}
          <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-6">
              <Outlet />
            </div>
            <SyncStatusWidget />
          </main>
        </div>
      </div>
    </div>
  );
}
