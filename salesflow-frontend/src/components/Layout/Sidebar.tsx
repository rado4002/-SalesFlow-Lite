import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/stock", label: "Stock", icon: "📦" },
    { path: "/stock-alerts", label: "Stock Alerts", icon: "⚠️" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/ml", label: "Machine Learning", icon: "🤖" },
    { path: "/reports", label: "Reports", icon: "📋" },

    // ✅ NEW ENTRY
    { path: "/excel-upload", label: "Import Excel", icon: "📥" },
  ];

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold">SalesFlow Lite</h1>
        <p className="text-gray-400 text-sm">Business Intelligence</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors
                    ${active ? "bg-primary-600 text-white shadow" : "text-gray-300 hover:bg-gray-700 hover:text-white"}
                  `}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>
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
