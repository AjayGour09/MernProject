import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  LogOut,
  RefreshCw,
  Building2,
  Wallet,
  ArrowRight,
  CircleCheckBig,
  CircleAlert,
  CircleDollarSign,
} from "lucide-react";

import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function balanceMeta(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      value: `₹${b}`,
      tone: "text-red-600",
      badge: "bg-red-50 text-red-700",
      icon: <CircleAlert className="h-4 w-4" />,
      helper: "Pending amount",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      tone: "text-green-600",
      badge: "bg-green-50 text-green-700",
      icon: <CircleDollarSign className="h-4 w-4" />,
      helper: "Advance balance",
    };
  }

  return {
    label: "Clear",
    value: "₹0",
    tone: "text-blue-600",
    badge: "bg-blue-50 text-blue-700",
    icon: <CircleCheckBig className="h-4 w-4" />,
    helper: "No pending amount",
  };
}

function SummaryTile({ title, value, icon, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className="mt-3 text-3xl font-black text-slate-900">{value}</div>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function ShopCard({ shop, onOpen }) {
  const meta = balanceMeta(shop.balance);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              <Building2 className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <div className="truncate text-xl font-black tracking-tight text-slate-900">
                {shop.shopName}
              </div>
              <div className="mt-1 text-sm text-slate-500">{meta.helper}</div>
            </div>
          </div>

          <div
            className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${meta.badge}`}
          >
            {meta.icon}
            {meta.label}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
            Balance
          </div>
          <div className={`mt-2 text-3xl font-black ${meta.tone}`}>
            {meta.value}
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpen(shop)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black"
      >
        Open Shop
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CustomerMyShops() {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const [shops, setShops] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const data = await apiGet("/customer-shops");
      setShops(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openShop = (shop) => {
    localStorage.setItem("smart_customer_shop", JSON.stringify(shop));
    navigate("/my-account", { replace: true });
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("smart_customer_shop");
    window.location.href = "/";
  };

  const totals = useMemo(() => {
    const total = shops.length;

    let bakiCount = 0;
    let advanceCount = 0;

    for (const s of shops) {
      const b = Number(s.balance || 0);
      if (b > 0) bakiCount += 1;
      else if (b < 0) advanceCount += 1;
    }

    return { total, bakiCount, advanceCount };
  }, [shops]);

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-5">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <Store className="h-4 w-4" />
                Smart Kirana Customer
              </div>

              <h1 className="mt-5 text-4xl font-black tracking-tight">
                My Shops
              </h1>

              <div className="mt-3 text-sm text-white/75">
                {user?.name || "Customer"} {user?.phone ? `• ${user.phone}` : ""}
              </div>

              <div className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Yahan se apni linked shops dekho aur kisi bhi shop ka account open karo.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={load}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <SummaryTile
            title="Linked Shops"
            value={totals.total}
            tone="blue"
            icon={<Building2 className="h-5 w-5" />}
          />

          <SummaryTile
            title="Pending Shops"
            value={totals.bakiCount}
            tone="red"
            icon={<Wallet className="h-5 w-5" />}
          />

          <SummaryTile
            title="Advance Shops"
            value={totals.advanceCount}
            tone="green"
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
        </div>

        {/* Errors */}
        {err ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* Shops */}
        <div className="mt-8">
          <div className="mb-4 text-2xl font-black tracking-tight text-slate-900">
            Available Shops
          </div>

          {!loading && shops.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-500 shadow-sm">
              No shops linked yet.
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            {shops.map((shop) => (
              <ShopCard key={shop.shopId} shop={shop} onOpen={openShop} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}