import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { productAPI } from "../../services/productAPI";

const Sidebar = () => {
  const location = useLocation();

  // ---------------------------------------------
  // LOW STOCK BADGE
  // ---------------------------------------------
  const [lowCount, setLowCount] = useState(0);

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
  // MENU — SALES BEFORE INVENTORY (AS REQUESTED)
  // ---------------------------------------------
  const menuItems = [
    { path: "/dashboard", label: "Home", icon: "🏠" },

    { path: "/products", label: "Products", icon: "🛍️" },

    // ✔ Sales BEFORE Inventory
    { path: "/sales", label: "Sales", icon: "💰" },

    {
      path: "/inventory",
      label: "Inventory",
      icon: "📦",
      badge: lowCount,
    },

    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/ml", label: "Forecast AI", icon: "🤖" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">

      {/* LOGO Area */}
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold">SalesFlow Lite</h1>
        <p className="text-gray-400 text-sm">Business Intelligence</p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <li key={item.path} className="relative">
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors
                    ${
                      active
                        ? "bg-primary-600 text-white shadow"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>

                  {/* BADGE LOW STOCK */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;
