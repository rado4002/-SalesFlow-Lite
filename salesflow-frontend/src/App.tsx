// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import MainLayout from "./components/Layout/MainLayout";

// Auth
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Analytics from "./pages/Analytics";
import ML from "./pages/ML";
import ImportExcelPage from "./pages/ImportExcel";   // <-- renommé proprement
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES (tout sous MainLayout) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* REDIRECT ROOT → DASHBOARD */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="sales" element={<Sales />} />

            {/* PAS BESOIN DE ProtectedRoute DANS ProtectedRoute */}
            <Route path="analytics" element={<Analytics />} />
            <Route path="ml" element={<ML />} />

            {/* ✔ Import Excel */}
            <Route path="excel-upload" element={<ImportExcelPage />} />

            <Route path="settings" element={<Settings />} />
          </Route>

          {/* CATCH-ALL */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}
