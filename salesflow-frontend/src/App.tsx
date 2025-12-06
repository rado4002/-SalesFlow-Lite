import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/Layout/MainLayout";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Analytics from "./pages/Analytics";
import ML from "./pages/ML";
import Reports from "./pages/Reports";
import StockAlerts from "./pages/StockAlerts";
import ExcelUpload from "./pages/ExcelUpload";   // ⬅️ NEW IMPORT

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* 🔓 Login sans layout */}
          <Route path="/login" element={<Login />} />

          {/* 🔐 Bloc Protégé : nécessite JWT + affiche MainLayout */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/stock-alerts" element={<StockAlerts />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ml" element={<ML />} />
            <Route path="/reports" element={<Reports />} />

            {/* ⬇️ NEW: Excel Import Page */}
            <Route path="/excel-upload" element={<ExcelUpload />} />
          </Route>

          {/* 🔄 Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
