// ==================================================
// AuthContext.tsx — Version corrigée avec nouvelle API
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

// 🔥 IMPORTANT : on importe depuis le bon fichier :
import { authAPI } from "../services/api/javaApi";

const devMode = import.meta.env.VITE_ENV === "dev";

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
  // INIT AUTH (DEV + PROD)
  // -------------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      // ---------- DEV MODE ----------
      if (devMode) {
        const fakeUser: User = {
          username: "developer",
          role: "admin",
          phoneNumber: "0771000001",
        };
        setUser(fakeUser);
        setToken("dev-token-123456");
        localStorage.setItem("token", "dev-token-123456");
        setIsLoading(false);
        return;
      }

      // ---------- PROD MODE ----------
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          // axios instance attaches the token automatically
          const me = await authAPI.me();

          setUser({
            username: me.username,
            role: me.role,
            phoneNumber: me.phoneNumber,
          });

          setToken(storedToken);
        } catch (err) {
          console.error("Invalid or expired token:", err);

          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // -------------------------------------------------
  // LOGIN
  // -------------------------------------------------
  const login = async (credentials: LoginCredentials) => {
    if (devMode) return;

    setIsLoading(true);

    try {
      const response: AuthResponse = await authAPI.login(credentials);

      // Save access token
      localStorage.setItem("token", response.accessToken);
      setToken(response.accessToken);

      // User included inside login response
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
    if (!devMode) {
      try {
        await authAPI.logout();
      } catch {
        console.warn("Logout request failed — ignored in frontend.");
      }
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
    devMode,
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
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

console.log("DEV MODE =", devMode, "VITE_ENV =", import.meta.env.VITE_ENV);
