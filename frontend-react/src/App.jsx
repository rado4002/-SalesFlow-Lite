// ===================== FINAL VERSION — src/App.jsx =====================

import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout
import DashboardLayout from "./layout/DashboardLayout";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import TestAPI from "./pages/TestAPI";
import TestMe from "./pages/TestMe";
import AdminDiagnostics from "./pages/AdminDiagnostics";

// Inventory
import InventoryList from "./pages/inventory/InventoryList";
import InventoryAdd from "./pages/inventory/InventoryAdd";
import InventoryEdit from "./pages/inventory/InventoryEdit";
import InventoryDetails from "./pages/inventory/InventoryDetails";

// Orders (ONLY EXISTING FILES)
import OrdersList from "./pages/orders/OrdersList";
import OrderCreate from "./pages/orders/OrderCreate";
import OrderDetails from "./pages/orders/OrderDetails";

export 
default function App() {
  return (
    <Routes>

      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- PROTECTED ROUTES ---------- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirect / → /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Utilities */}
        <Route path="test-api" element={<TestAPI />} />
        <Route path="test-me" element={<TestMe />} />

        {/* Admin */}
        <Route path="admin/diagnostics" element={<AdminDiagnostics />} />

        {/* ---------- INVENTORY ---------- */}
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/add" element={<InventoryAdd />} />
        <Route path="inventory/edit/:id" element={<InventoryEdit />} />
        <Route path="inventory/:id" element={<InventoryDetails />} />

        {/* ---------- ORDERS ---------- */}
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/create" element={<OrderCreate />} />
        {/* OrderDetails will be added later — safe to remove for now */}
        <Route path="orders/:id" element={<OrderDetails />} />
      </Route>

      {/* ---------- CATCH ALL ---------- */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}