import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import RoleSelect from "./pages/auth/RoleSelect";
import AuthPage from "./pages/auth/AuthPage";
import AdminPage from "./pages/admin/AdminPage";
import CustomerPage from "./pages/customer/CustomerPage";
import AdminRoute from "./components/AdminRoute";
import CustomerRoute from "./components/CustomerRoute";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/choose/:mode" element={<RoleSelect />} />
        <Route path="/auth/:mode/:role" element={<AuthPage />} />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />

        <Route
          path="/my-account"
          element={
            <CustomerRoute>
              <CustomerPage />
            </CustomerRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}