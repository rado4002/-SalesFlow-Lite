// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, accessToken, refreshTokenIfNeeded } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      try {
        // Attempt silent token refresh (only if needed)
        await refreshTokenIfNeeded();
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();
    return () => {
      mounted = false;
    };
  }, [refreshTokenIfNeeded]);

  // Loading state while validating authentication
  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-neutral-900">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Checking authentication…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated → redirect to login
  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated → allow route
  return children;
}