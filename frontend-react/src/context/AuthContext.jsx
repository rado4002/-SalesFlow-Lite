// =============================================
// src/context/AuthContext.jsx — FINAL VERSION
// =============================================

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api, {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../api/http";

const AuthContext = createContext(null);

// ======================================================
// TOKEN EXPIRY (ms)
// ======================================================
function getTokenExpiryMs(token) {
  if (!token) return null;
  try {
    const payload = jwtDecode(token);
    const raw = payload.exp;
    if (!raw) return null;
    return raw < 1e12 ? raw * 1000 : raw;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());
  const [refreshToken, setRefreshTokenState] = useState(() => getRefreshToken());

  const [user, setUser] = useState(() => {
    const t = getAccessToken();
    if (!t) return null;
    try {
      const p = jwtDecode(t);
      const authUser = {
        username: p.username || null,
        phone: p.sub || p.phone || null,
        role: p.role || null,
        organization: p.organization || null,
      };
      localStorage.setItem("authUser", JSON.stringify(authUser));
      return authUser;
    } catch {
      return null;
    }
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ------------------------------------------------------
  // NETWORK STATUS
  // ------------------------------------------------------
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // ------------------------------------------------------
  // SYNC TOKENS
  // ------------------------------------------------------
  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    else localStorage.removeItem("refreshToken");
  }, [refreshToken]);

  // ------------------------------------------------------
  // INTERNAL SETTER
  // ------------------------------------------------------
  const setTokensLocal = ({ accessToken: a, refreshToken: r }) => {
    if (a) {
      setAccessTokenState(a);
      api.defaults.headers.common.Authorization = `Bearer ${a}`;
    }
    if (r) {
      setRefreshTokenState(r);
    }
    setTokens({ accessToken: a, refreshToken: r });
  };

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async ({ phoneNumber, password }) => {
    try {
      const resp = await api.post("/api/v1/auth/login", {
        phoneNumber,
        password,
      });

      const data = resp.data || {};

      const newAccess = data.accessToken;
      const newRefresh = data.refreshToken;

      if (!newAccess) throw new Error("Login failed: missing access token");

      setTokensLocal({ accessToken: newAccess, refreshToken: newRefresh });

      // Decode user
      try {
        const p = jwtDecode(newAccess);
        const authUser = {
          username: p.username,
          phone: p.sub || p.phone,
          role: p.role,
          organization: p.organization,
        };
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } catch {
        setUser(null);
      }

      navigate("/dashboard", { replace: true });
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // ======================================================
  // REGISTER
  // ======================================================
  const register = async ({ phoneNumber, username, email, password }) => {
    try {
      const resp = await api.post("/api/v1/auth/register", {
        phoneNumber,
        username,
        email,
        password,
      });

      return { ok: true, data: resp.data };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const logout = async () => {
    try {
      const rt = getRefreshToken();
      if (rt) {
        await api.post("/api/v1/auth/logout", { refreshToken: rt });
      }
    } catch {}

    clearTokens();
    setAccessTokenState(null);
    setRefreshTokenState(null);
    setUser(null);
    navigate("/login", { replace: true });
  };

  // ======================================================
  // REFRESH TOKEN
  // ======================================================
  const refresh = async () => {
    const rt = getRefreshToken();
    if (!rt) throw new Error("No refresh token available");

    const resp = await api.post("/api/v1/auth/refresh", { refreshToken: rt });
    const data = resp.data || {};

    const newAccess = data.accessToken;
    const newRefresh = data.refreshToken || rt;

    if (!newAccess) throw new Error("Refresh failed: no access token");

    setTokensLocal({ accessToken: newAccess, refreshToken: newRefresh });

    try {
      const p = jwtDecode(newAccess);
      setUser({
        username: p.username,
        phone: p.sub,
        role: p.role,
        organization: p.organization,
      });
    } catch {
      setUser(null);
    }

    return { accessToken: newAccess, refreshToken: newRefresh };
  };

  // ======================================================
  // CHECK IF NEED REFRESH
  // ======================================================
  const refreshTokenIfNeeded = async () => {
    const token = getAccessToken();
    if (!token) return null;

    const expMs = getTokenExpiryMs(token);
    if (!expMs) return null;

    const remaining = expMs - Date.now();
    const SAFETY = 60000;

    if (remaining <= SAFETY) {
      try {
        const result = await refresh();
        return result.accessToken;
      } catch {
        return null;
      }
    }
    return null;
  };

  // ======================================================
  // AUTO REFRESH LOOP
  // ======================================================
  const refreshInProgressRef = useRef(false);

  useEffect(() => {
    const INTERVAL_MS = 30000;

    const check = async () => {
      if (!isOnline) return;
      if (refreshInProgressRef.current) return;

      const token = getAccessToken();
      if (!token) return;

      const expMs = getTokenExpiryMs(token);
      if (!expMs) return;

      const remaining = expMs - Date.now();
      const SAFETY = 60000;

      if (remaining <= SAFETY) {
        refreshInProgressRef.current = true;
        try {
          await refresh();
        } catch {
          clearTokens();
          navigate("/login?session=expired", { replace: true });
        } finally {
          refreshInProgressRef.current = false;
        }
      }
    };

    check();
    const id = setInterval(check, INTERVAL_MS);
    return () => clearInterval(id);
  }, [refreshToken, isOnline, navigate]);

  // ======================================================
  // PROVIDER VALUE
  // ======================================================
  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: !!accessToken,
      isOnline,
      login,
      register,
      logout,
      refresh,
      refreshTokenIfNeeded,
    }),
    [accessToken, refreshToken, user, isOnline]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
