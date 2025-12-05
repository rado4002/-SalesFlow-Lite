// ===========================================================================
// Premium Sidebar — SalesFlow v2
// Clean Indigo Theme • Mobile Drawer • Offline User Support
// ===========================================================================
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Home,
  Database,
  ShoppingCart,
  Users,
  BarChart2,
  ServerCog,
  X,
  Building2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { t } = useTranslation();
  const { user: userFromContext } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  // fallback snapshot from localStorage when offline
  const local = typeof window !== "undefined" ? localStorage.getItem("authUser") : null;
  const parsedLocalUser = local ? (() => { try { return JSON.parse(local); } catch { return null; } })() : null;

  const user = userFromContext || parsedLocalUser || {};
  const organizationName = user.organization || t("my_shop", "My Shop");

  // Listen for mobile-open trigger from Topbar
  useEffect(() => {
    const handler = () => setMobileOpen(true);
    window.addEventListener("open-mobile-sidebar", handler);
    return () => window.removeEventListener("open-mobile-sidebar", handler);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  // navigation model
  const menu = [
    { path: "/dashboard", label: t("dashboard"), icon: Home },
    { path: "/inventory", label: t("inventory"), icon: Database },
    { path: "/orders", label: t("orders"), icon: ShoppingCart },
    { path: "/customers", label: t("customers"), icon: Users },
    { path: "/analytics", label: t("analytics"), icon: BarChart2 },
    { path: "/settings", label: t("settings"), icon: ServerCog },
  ];

  // reused rendering for desktop & mobile
  const renderNavItems = (onSelect = () => {}) => (
    <nav className="flex flex-col gap-2 px-3 py-2">
      {menu.map((m) => {
        const Icon = m.icon;
        return (
          <NavLink
            key={m.path}
            to={m.path}
            onClick={() => onSelect()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-700 dark:text-slate-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`
            }
          >
            <Icon size={18} />
            <span>{m.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );

  // user block UI
  const UserBlock = (
    <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
        {user?.username ? user.username[0].toUpperCase() : "U"}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {user?.username || "User"}
        </p>
        <p className="text-xs text-neutral-500">{user?.role || "ROLE_USER"}</p>

        <p className="text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1">
          <Building2 size={12} />
          {organizationName}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* ============================
          DESKTOP SIDEBAR
      ============================ */}
      <aside
        className="hidden md:flex flex-col w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 min-h-screen shadow-lg"
        aria-label="Sidebar"
      >
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
            SalesFlow
          </h1>
        </div>

        {UserBlock}

        <div className="flex-1 overflow-y-auto mt-3">
          {renderNavItems()}
        </div>

        {/* FOOTER */}
        <div className="p-4 text-xs text-center opacity-70 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Building2 size={14} />
            <span>SalesFlow Lite</span>
          </div>
          <div>v0.1</div>
        </div>
      </aside>

      {/* ============================
          MOBILE OVERLAY (click to close)
      ============================ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={closeMobile}
        />
      )}

      {/* ============================
          MOBILE DRAWER
      ============================ */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-50 md:hidden 
        transform transition-transform duration-300 shadow-xl
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-2xl font-extrabold text-indigo-600">SalesFlow</h1>

          <button
            aria-label="Close menu"
            onClick={closeMobile}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition shadow-sm"
          >
            <X size={20} className="text-neutral-700 dark:text-neutral-300" />
          </button>
        </div>

        {UserBlock}

        <div className="mt-4">{renderNavItems(closeMobile)}</div>
      </aside>
    </>
  );
}
