import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home.jsx";
import Customers from "./pages/customer/Customers.jsx";
import Khata from "./pages/khata/Khata.jsx";
import Stock from "./pages/stock/Stock.jsx";
import Sales from "./pages/sales/Sales.jsx";
import CustomerDetails from "./pages/CustomerDetails/CustomerDetails";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/khata" element={<Khata />} />
        <Route path="/stock" element={<Stock />} />
         <Route path="/sales" element={<Sales />} />
         <Route path="/customers/:id" element={<CustomerDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}