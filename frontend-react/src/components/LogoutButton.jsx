// src/components/LogoutButton.jsx
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LogoutButton({ className = "" }) {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg 
        bg-red-600 text-white shadow hover:bg-red-700 transition
        ${className}
      `}
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}
