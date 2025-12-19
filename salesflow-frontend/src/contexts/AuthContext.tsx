// ==================================================
// AuthContext.tsx — Unified, environment-agnostic
// ==================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type {
  User,
  LoginCredentials,
  AuthContextType,
  AuthResponse,
} from "../types/auth";

import { authAPI } from "../services/api/javaApi";

// ==================================================
// CONTEXT
// ==================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==================================================
// PROVIDER
// ==================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);

  // -------------------------------------------------
  // INIT AUTH — SINGLE SOURCE OF TRUTH = BACKEND
  // -------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        // Token is automatically attached by axios interceptor
        const me = await authAPI.me();

        setUser({
          username: me.username,
          role: me.role,
          phoneNumber: me.phoneNumber,
        });

        setToken(storedToken);
      } catch (error) {
        console.error("Invalid or expired token:", error);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      const response: AuthResponse = await authAPI.login(credentials);

      localStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);

      if (response.user) {
        setUser({
          username: response.user.username,
          role: response.user.role,
          phoneNumber: response.user.phoneNumber,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------
  // LOGOUT
  // -------------------------------------------------
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      console.warn("Logout request failed — ignored.");
    }

    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading,
    setUser,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================================================
// HOOK
// ==================================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
