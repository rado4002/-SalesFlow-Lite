// src/components/Topbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import MobileSidebarButton from "./MobileSidebarButton";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Topbar({ title, subtitle }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="flex items-center justify-between gap-4">
      
      {/* LEFT: Mobile button + Title */}
      <div className="flex items-center gap-4">
        <MobileSidebarButton
          onOpen={() =>
            window.dispatchEvent(new Event("open-mobile-sidebar"))
          }
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: Search + User dropdown */}
      <div className="flex items-center gap-4">

        {/* SEARCH BAR */}
        <div className="hidden sm:flex items-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 gap-2 shadow-sm">
          <Search size={16} className="text-neutral-600 dark:text-neutral-300" />
          <input
            className="bg-transparent outline-none text-sm w-40 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            placeholder={t("search") || "Search..."}
          />
        </div>

        {/* USER MENU */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl hover:shadow-md transition"
          >
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {initials}
            </div>
            <ChevronDown size={18} className="text-neutral-700 dark:text-neutral-300" />
          </button>

          {/* DROPDOWN */}
          {open && (
            <div className="absolute right-0 mt-3 w-60 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-50">
              
              {/* USER INFO */}
              <div className="px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-neutral-500">{user?.role}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                  {user?.organization || "My Shop"}
                </p>
              </div>

              {/* OPTIONS */}
              <div className="flex flex-col">
                <button
                  onClick={() => (window.location.href = "/test-me")}
                  className="px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                >
                  {t("test_me") || "Profile"}
                </button>

                <button
                  onClick={() => (window.location.href = "/settings")}
                  className="px-4 py-3 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left"
                >
                  {t("settings") || "Settings"}
                </button>

                <button
                  onClick={logout}
                  className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 text-left"
                >
                  {t("logout") || "Logout"}
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
