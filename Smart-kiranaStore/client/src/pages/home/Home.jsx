import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Wallet,
  Boxes,
  BadgeIndianRupee,
  RefreshCw,
  Store,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { SummaryAPI } from "../../services/summary.api";
import { AuthService } from "../../services/auth";

function StatCard({ title, value, sub, to, icon }) {
  return (
    <Link
      to={to}
      className="group rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-500">{title}</div>
          <div className="mt-2 text-3xl font-black tracking-tight text-gray-900">
            {value}
          </div>
          {sub ? <div className="mt-2 text-sm text-gray-500">{sub}</div> : null}
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white">
          {icon}
        </div>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-gray-800">
        Open
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ActionCard({ to, title, sub }) {
  return (
    <Link
      to={to}
      className="rounded-[28px] border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="text-lg font-black tracking-tight text-gray-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-gray-500">{sub}</div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const user = AuthService.getUser();
  const shop = AuthService.getSelectedShop();

  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayDate: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await SummaryAPI.get();
      setData(res);
    } catch (e) {
      setErr(e.message || "Summary load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shop?._id) {
      navigate("/shops", { replace: true });
      return;
    }
    load();
  }, [shop?._id]);

  const logout = () => {
    AuthService.logout();
    window.location.href = "/admin/login";
  };

  const changeShop = () => {
    navigate("/shops");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[32px] bg-[#0f172a] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <Store className="h-4 w-4" />
                Admin Dashboard
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
                {shop?.shopName || "Smart Kirana"}
              </h1>

              <p className="mt-3 text-sm text-white/70">
                {user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}
              </p>

              <p className="mt-2 text-sm text-white/60">
                {shop?.phone || "No phone"} {shop?.address ? `• ${shop.address}` : ""}
              </p>

              {data.todayDate ? (
                <div className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                  Date: {data.todayDate}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={changeShop}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Change Shop
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today Sales"
            value={`₹ ${data.todaySales}`}
            sub="Cash + UPI"
            to="/sales"
            icon={<BadgeIndianRupee className="h-5 w-5" />}
          />
          <StatCard
            title="Total Customers"
            value={data.totalCustomers}
            sub="Linked customers"
            to="/customers"
            icon={<Users className="h-5 w-5" />}
          />
          <StatCard
            title="Total Baki"
            value={`₹ ${data.totalBaki}`}
            sub="Khata balance"
            to="/khata"
            icon={<Wallet className="h-5 w-5" />}
          />
          <StatCard
            title="Low Stock"
            value={data.lowStockCount}
            sub="Need attention"
            to="/stock"
            icon={<Boxes className="h-5 w-5" />}
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <ActionCard
            to="/customers"
            title="Customers"
            sub="Customer add karo, detail dekho aur history track karo."
          />
          <ActionCard
            to="/khata"
            title="Khata"
            sub="Udhaar aur payment entries clean way me manage karo."
          />
          <ActionCard
            to="/stock"
            title="Stock"
            sub="Products, low stock aur quick quantity updates handle karo."
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ActionCard
            to="/sales"
            title="Daily Sales"
            sub="Cash aur UPI ke through aaj ki sales save aur review karo."
          />
          <ActionCard
            to="/shops"
            title="My Shops"
            sub="Apni dusri shops ko open ya switch karo."
          />
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}
      </div>
    </div>
  );
}