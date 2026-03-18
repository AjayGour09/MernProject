import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";

import { SummaryAPI } from "../../services/summary.api";
import { AuthService } from "../../services/auth";
export default function Home() {
  const navigate = useNavigate();

  const user = AuthService.getUser();
  const shop = AuthService.getSelectedShop();

  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
    todaySales: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shop?._id) {
      navigate("/shops", { replace: true });
      return;
    }

    loadSummary();
  }, [shop?._id]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const data = await SummaryAPI.get();
      setSummary(data);
    } catch (e) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container title="Dashboard">
        {/* HEADER */}
        <div className="rounded-3xl bg-gradient-to-br from-black to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm text-white/70">Welcome back 👋</div>

          <div className="mt-2 text-2xl font-extrabold">
            {user?.name || "Admin"}
          </div>

          <div className="mt-2 rounded-2xl bg-white/10 px-4 py-3">
            <div className="text-xs text-white/60">Selected Shop</div>
            <div className="text-lg font-bold">
              {shop?.shopName || "No Shop"}
            </div>
          </div>
        </div>

        {/* SUMMARY GRID */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="text-xs text-gray-500">Customers</div>
            <div className="mt-2 text-2xl font-extrabold text-gray-900">
              {loading ? "..." : summary.totalCustomers}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="text-xs text-gray-500">Today Sales</div>
            <div className="mt-2 text-2xl font-extrabold text-green-700">
              ₹{loading ? "..." : summary.todaySales}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="text-xs text-gray-500">Total Baki</div>
            <div className="mt-2 text-2xl font-extrabold text-red-700">
              ₹{loading ? "..." : summary.totalBaki}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="text-xs text-gray-500">Low Stock</div>
            <div className="mt-2 text-2xl font-extrabold text-yellow-600">
              {loading ? "..." : summary.lowStockCount}
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-5 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">
            Quick Actions
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/customers")}
              className="rounded-2xl border py-3 font-semibold active:scale-[0.98]"
            >
              👥 Customers
            </button>

            <button
              onClick={() => navigate("/khata")}
              className="rounded-2xl border py-3 font-semibold active:scale-[0.98]"
            >
              📒 Khata
            </button>

            <button
              onClick={() => navigate("/stock")}
              className="rounded-2xl border py-3 font-semibold active:scale-[0.98]"
            >
              📦 Stock
            </button>

            <button
              onClick={() => navigate("/sales")}
              className="rounded-2xl border py-3 font-semibold active:scale-[0.98]"
            >
              💰 Sales
            </button>
          </div>
        </div>

        {/* FOOTER INFO */}
        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-sm text-gray-500">
            Smart Kirana helps manage your shop faster and smarter.
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}