import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { token, isLoading, devMode } = useAuth();

  // ⏳ Tant que AuthContext charge le token, on attend
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔥 DEV MODE → bypass total
  if (devMode) {
    return <>{children}</>;
  }

  // 🔴 PROD MODE → token obligatoire
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
