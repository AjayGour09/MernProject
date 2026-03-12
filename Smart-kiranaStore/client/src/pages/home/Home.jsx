import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SummaryAPI } from "../../services/summary.api";
import { AuthService } from "../../services/auth";

function StatCard({ label, value, sub, to }) {
  const card = (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99] transition">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );

  return to ? <Link to={to}>{card}</Link> : card;
}

function ActionBtn({ to, children, variant = "dark" }) {
  const base =
    "rounded-2xl px-4 py-4 text-center font-semibold shadow-sm ring-1 ring-black/5 active:scale-[0.99] transition";
  const cls =
    variant === "dark"
      ? `${base} bg-black text-white`
      : `${base} bg-white text-gray-900`;

  return (
    <Link to={to} className={cls}>
      {children}
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

  const load = async () => {
    setErr("");
    try {
      const res = await SummaryAPI.get();
      setData(res);
    } catch (e) {
      setErr(e.message || "Summary load failed");
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
    <>
      <Container
        title={shop?.shopName || "Smart Kirana"}
        right={
          <div className="flex gap-2">
            <button
              onClick={load}
              className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
            >
              ↻
            </button>
            <button
              onClick={changeShop}
              className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
            >
              Shops
            </button>
            <button
              onClick={logout}
              className="rounded-xl border bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 active:scale-[0.99]"
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-sm text-gray-500">Logged in as</div>
          <div className="mt-1 flex items-center justify-between">
            <div>
              <div className="text-lg font-extrabold text-gray-900">
                {user?.name || "Admin"}
              </div>
              <div className="text-sm text-gray-500">{user?.email || ""}</div>
            </div>
            <div className="rounded-xl bg-black px-3 py-2 text-xs font-bold text-white">
              ADMIN
            </div>
          </div>
          {shop ? (
            <div className="mt-3 rounded-2xl border p-3">
              <div className="text-xs text-gray-500">Current Shop</div>
              <div className="text-base font-bold text-gray-900">{shop.shopName}</div>
              <div className="text-xs text-gray-500">
                {shop.phone || "No phone"} {shop.address ? `• ${shop.address}` : ""}
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-2xl bg-black p-5 text-white shadow-sm">
          <div className="text-sm opacity-80">Dashboard</div>
          <div className="mt-1 text-2xl font-extrabold">Aaj ka status 👇</div>
          {data.todayDate ? (
            <div className="mt-2 text-xs opacity-80">Date: {data.todayDate}</div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            label="Today Sales"
            value={`₹ ${data.todaySales}`}
            sub="Cash + UPI"
            to="/sales"
          />
          <StatCard
            label="Low Stock"
            value={data.lowStockCount}
            sub="Qty ≤ MinStock"
            to="/stock"
          />
          <StatCard
            label="Total Baki"
            value={`₹ ${data.totalBaki}`}
            sub="Udhaar total"
            to="/khata"
          />
          <StatCard
            label="Customers"
            value={data.totalCustomers}
            sub="Total count"
            to="/customers"
          />
        </div>

        <div className="mt-5">
          <div className="mb-2 text-sm font-bold text-gray-900">Quick Actions</div>
          <div className="grid gap-3">
            <ActionBtn to="/khata" variant="dark">
              📒 Khata (Udhaar / Payment)
            </ActionBtn>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn to="/sales" variant="light">
                💰 Daily Sales
              </ActionBtn>
              <ActionBtn to="/stock" variant="light">
                📦 Stock
              </ActionBtn>
            </div>
            <ActionBtn to="/customers" variant="light">
              👤 Customers
            </ActionBtn>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-red-600 shadow-sm ring-1 ring-black/5">
            {err}
          </div>
        ) : null}
      </Container>

      <BottomNav />
    </>
  );
}