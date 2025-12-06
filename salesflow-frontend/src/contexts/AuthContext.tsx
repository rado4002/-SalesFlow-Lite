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

import { authAPI } from "../services/api";
const devMode = import.meta.env.VITE_ENV === "dev";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);


  // ----------------------------------------------
  // 🔥 DEV / PROD SWITCH
  // ----------------------------------------------
  const devMode = import.meta.env.VITE_ENV === "dev";

  // ----------------------------------------------
  // INIT AUTH
  // ----------------------------------------------
  useEffect(() => {
    const initializeAuth = async () => {
      // ------------------------------------------
      // 🔵 DEV MODE → auto login + fake token
      // ------------------------------------------
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

      // ------------------------------------------
      // 🔴 PROD MODE → Verify token via backend Java
      // ------------------------------------------
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const me = await authAPI.verifyToken(storedToken);

          setUser({
            username: me.username,
            role: me.role,
            phoneNumber: me.phoneNumber,
          });

          setToken(storedToken);
        } catch (err) {
          console.error("❌ Invalid token:", err);
          localStorage.removeItem("token");
          setUser(null);
          setToken(null);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // ----------------------------------------------
  // LOGIN
  // ----------------------------------------------
  const login = async (credentials: LoginCredentials) => {
    // 🔵 DEV MODE → bypass login completely
    if (devMode) return;

    setIsLoading(true);

    try {
      const response: AuthResponse = await authAPI.login(credentials);

      localStorage.setItem("token", response.token);
      setToken(response.token);

      // If user info is included in token response
      if (response.user) {
        setUser(response.user);
      } else {
        // Otherwise fetch via /auth/me
        const me = await authAPI.verifyToken(response.token);

        setUser({
          username: me.username,
          role: me.role,
          phoneNumber: me.phoneNumber,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------
  // LOGOUT
  // ----------------------------------------------
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  // ----------------------------------------------
  // CONTEXT VALUE
  // ----------------------------------------------
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
console.log("🔥 DEV MODE =", devMode, "VITE_ENV =", import.meta.env.VITE_ENV);
