import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { useLayout } from "../../contexts/LayoutContext";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { sidebarCollapsed, toggleSidebar } = useLayout();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">

        {/* LEFT — Toggle + Greeting */}
        <div className="flex items-center gap-4">
          {/* SIDEBAR TOGGLE */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* GREETING */}
          <h2 className="text-xl font-semibold text-gray-800">
            {t("navbar.welcome")}{" "}
            <span className="text-primary-600">
              {user?.username}
            </span>
          </h2>
        </div>

        {/* RIGHT — Controls */}
        <div className="flex items-center space-x-6">

          {/* LANGUAGE SWITCH */}
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="ln">LN</option>
            <option value="sw">SW</option>
          </select>

          {/* USER INFO */}
          <div className="text-right leading-tight hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.username}
            </p>

            <p className="text-xs text-gray-500 uppercase">
              {user?.role}
            </p>

            {user?.phoneNumber && (
              <p className="text-xs text-gray-400">
                {user.phoneNumber}
              </p>
            )}
          </div>

          {/* AVATAR */}
          <button
            onClick={() => navigate("/settings")}
            className="
              w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center 
              text-white font-semibold text-lg hover:bg-primary-600 transition
            "
            title={t("navbar.accountSettings")}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </button>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="
              bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg 
              transition font-medium shadow-sm
            "
          >
            {t("navbar.logout")}
          </button>

        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
