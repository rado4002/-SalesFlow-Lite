import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, isLoading } = useAuth();

  // ⏳ Wait until auth initialization is done
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔴 No token → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated → allow access
  return <>{children}</>;
};

export default ProtectedRoute;
