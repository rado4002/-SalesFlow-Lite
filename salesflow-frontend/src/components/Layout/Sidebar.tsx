import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { productAPI } from "../../services/productAPI";
import { useLayout } from "../../contexts/LayoutContext";

import {
  Home,
  ShoppingBag,
  DollarSign,
  Boxes,
  LineChart,
  Bot,
  Settings,
  ChevronLeft,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { sidebarCollapsed, toggleSidebar } = useLayout();

  // ---------------------------------------------
  // LOW STOCK BADGE
  // ---------------------------------------------
  const [lowCount, setLowCount] = useState<number>(0);

  const loadLowStock = async () => {
    try {
      const res = await productAPI.getLowStock();
      setLowCount(res.data.length);
    } catch (err) {
      console.error("Failed to load low stock count:", err);
    }
  };

  useEffect(() => {
    loadLowStock();
    const interval = setInterval(loadLowStock, 30000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------
  // MENU CONFIG
  // ---------------------------------------------
  const menuItems = [
    {
      path: "/dashboard",
      label: t("sidebar.dashboard"),
      icon: Home,
    },
    {
      path: "/products",
      label: t("sidebar.products"),
      icon: ShoppingBag,
    },
    {
      path: "/sales",
      label: t("sidebar.sales"),
      icon: DollarSign,
    },
    {
      path: "/inventory",
      label: t("sidebar.inventory"),
      icon: Boxes,
      badge: lowCount,
    },
    {
      path: "/analytics",
      label: t("sidebar.analytics"),
      icon: LineChart,
    },
    {
      path: "/ml",
      label: t("sidebar.forecast"),
      icon: Bot,
    },
    {
      path: "/settings",
      label: t("sidebar.settings"),
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        bg-gray-800 text-white min-h-screen flex flex-col
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? "w-16" : "w-64"}
      `}
    >
      {/* LOGO + TOGGLE */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div>
            <h1 className="text-xl font-bold">SalesFlow Lite</h1>
            <p className="text-gray-400 text-xs">{t("app.subtitle")}</p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-gray-700 transition"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    group relative flex items-center gap-3 px-3 py-3 rounded-lg
                    transition-colors duration-200
                    ${
                      active
                        ? "bg-primary-600 text-white shadow"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <Icon size={20} />

                  {/* LABEL */}
                  {!sidebarCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {/* BADGE */}
                  {!sidebarCollapsed &&
                    item.badge !== undefined &&
                    item.badge > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}

                  {/* TOOLTIP (collapsed) */}
                  {sidebarCollapsed && (
                    <span
                      className="
                        absolute left-full ml-3 whitespace-nowrap
                        hidden group-hover:block
                        bg-black text-white text-xs
                        px-2 py-1 rounded shadow-lg
                      "
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
