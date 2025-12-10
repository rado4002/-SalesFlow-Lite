import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5174,
    host: "127.0.0.1",      // 🔥 Force IPv4 → évite ERR_CONNECTION_REFUSED (localhost=::1 problème Windows)

    proxy: {
      // 🔥 JAVA BACKEND PROXY
      "/java": {
        target: "http://10.131.175.145:8080/api/v1",
        changeOrigin: true,
      },

      // 🔥 PYTHON BACKEND PROXY
      "/py": {
        target: "http://127.0.0.1:8081",
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
