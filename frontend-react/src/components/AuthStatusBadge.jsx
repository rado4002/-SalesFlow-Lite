// src/components/AuthStatusBadge.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthStatusBadge() {
  const { isOnline, accessToken } = useAuth();

  return (
    <div className="fixed bottom-3 right-3 flex flex-col gap-2">
      {!isOnline && (
        <span className="px-3 py-1 text-white bg-red-500 rounded-lg text-sm shadow">
          Offline Mode
        </span>
      )}

      {accessToken && (
        <span className="px-3 py-1 text-white bg-green-600 rounded-lg text-sm shadow">
          Authenticated
        </span>
      )}
    </div>
  );
}
