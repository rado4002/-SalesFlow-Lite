// src/hooks/useAuthRequest.js
import { useState, useCallback } from "react";
import api from "../api/http";
import { useAuth } from "../context/AuthContext";

export default function useAuthRequest() {
  const { isOnline } = useAuth();

  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [refreshed, setRefreshed] = useState(false);

  const send = useCallback(async (config) => {
    setLoading(true);
    setRetrying(false);
    setError(null);
    setRefreshed(false);

    try {
      const response = await api(config);
      setData(response.data);
      return { ok: true, data: response.data };
    } catch (err) {
      const status = err?.response?.status;

      // The axios interceptor handles actual refresh logic.  
      // If refresh happened, axios will retry the request.
      // We detect retry by checking "_retry" flag.
      if (config._retry) {
        setRetrying(true);
        setRefreshed(true);
      }

      setError(err);
      return { ok: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [isOnline]);

  return {
    send,
    loading,
    retrying,
    error,
    data,
    refreshed,
  };
}
