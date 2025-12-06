import { useAuth } from "../../contexts/AuthContext";

const TopNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">

        {/* Left - Welcome */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back,{" "}
            <span className="text-primary-600">
              {user?.username}
            </span>
          </h2>
        </div>

        {/* Right - User info + Logout */}
        <div className="flex items-center space-x-4">
          
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.username}
            </p>

            <p className="text-sm text-gray-500">
              {user?.role}
            </p>

            <p className="text-xs text-gray-400">
              {user?.phoneNumber}
            </p>
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default TopNavbar;
