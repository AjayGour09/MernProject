import { Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/public/Landing.jsx";
import AuthGateway from "./pages/public/AuthGateway.jsx";

import Home from "./pages/home/Home.jsx";
import Customers from "./pages/customer/Customers.jsx";
import Khata from "./pages/khata/Khata.jsx";
import Stock from "./pages/stock/Stock.jsx";
import Sales from "./pages/sales/Sales.jsx";
import CustomerDetails from "./pages/CustomerDetails/CustomerDetails.jsx";

import AdminLogin from "./pages/auth/AdminLogin.jsx";
import AdminSetup from "./pages/auth/AdminSetup.jsx";
import CustomerLogin from "./pages/auth/CustomerLogin.jsx";
import CustomerSetPassword from "./pages/auth/CustomerSetPassword.jsx";

import MyAccount from "./pages/customer/MyAccount.jsx";
import CustomerMyShops from "./pages/customer/MyShops.jsx";
import AdminMyShops from "./pages/shop/MyShops.jsx";

import AdminRoute from "./components/AdminRoute.jsx";
import CustomerRoute from "./components/CustomerRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />

      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth-gateway" element={<AuthGateway />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route
            path="/customer/set-password"
            element={<CustomerSetPassword />}
          />

          <Route
            path="/shops"
            element={
              <AdminRoute>
                <AdminMyShops />
              </AdminRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Home />
              </AdminRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <AdminRoute>
                <Customers />
              </AdminRoute>
            }
          />

          <Route
            path="/customers/:id"
            element={
              <AdminRoute>
                <CustomerDetails />
              </AdminRoute>
            }
          />

          <Route
            path="/khata"
            element={
              <AdminRoute>
                <Khata />
              </AdminRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <AdminRoute>
                <Stock />
              </AdminRoute>
            }
          />

          <Route
            path="/sales"
            element={
              <AdminRoute>
                <Sales />
              </AdminRoute>
            }
          />

          <Route
            path="/my-shops"
            element={
              <CustomerRoute>
                <CustomerMyShops />
              </CustomerRoute>
            }
          />

          <Route
            path="/my-account"
            element={
              <CustomerRoute>
                <MyAccount />
              </CustomerRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}