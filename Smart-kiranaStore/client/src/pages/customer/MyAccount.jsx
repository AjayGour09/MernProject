import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Store,
  ArrowLeft,
  LogOut,
  RefreshCw,
  CalendarDays,
  BadgeIndianRupee,
  Clock3,
  ArrowDownCircle,
  ArrowUpCircle,
} from "lucide-react";

import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function statusMeta(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      tone: "text-red-600",
      bg: "bg-red-50",
      desc: "Aapko itna payment karna hai",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      tone: "text-green-600",
      bg: "bg-green-50",
      desc: "Aapke account me advance balance hai",
    };
  }

  return {
    label: "Clear",
    tone: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Koi pending balance nahi hai",
  };
}

function SummaryCard({ title, value, icon, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>

          <div className="mt-3 text-3xl font-black text-slate-900">
            {value}
          </div>
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

function TxCard({ tx }) {
  const isPayment = tx.type === "PAYMENT";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isPayment ? (
              <ArrowDownCircle className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowUpCircle className="h-5 w-5 text-red-600" />
            )}

            <div className="font-bold text-slate-900">
              {isPayment ? "Payment" : "Udhaar"}
            </div>
          </div>

          <div className="mt-2 text-sm text-slate-500">
            {new Date(tx.createdAt).toLocaleString()}
          </div>

          {tx.note ? (
            <div className="mt-3 text-sm text-slate-600">{tx.note}</div>
          ) : null}

          {!isPayment && tx.items?.length ? (
            <div className="mt-3 space-y-2">
              {tx.items.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-slate-50 px-3 py-2 text-sm"
                >
                  {item.name} • {item.qty} × ₹{item.price} = ₹{item.total}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div
          className={`text-2xl font-black ${
            isPayment ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{tx.amount}
        </div>
      </div>
    </div>
  );
}

export default function MyAccount() {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const selectedShop = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("smart_customer_shop") || "null");
    } catch {
      return null;
    }
  }, []);

  const [data, setData] = useState({
    shop: null,
    balance: 0,
    ledger: [],
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!selectedShop?.shopId) {
      navigate("/my-shops", { replace: true });
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const res = await apiGet(`/customer-account?shopId=${selectedShop.shopId}`);
      setData({
        shop: res.shop || null,
        balance: Number(res.balance || 0),
        ledger: Array.isArray(res.ledger) ? res.ledger : [],
      });
    } catch (e) {
      setErr(e.message || "Failed to load account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const meta = useMemo(() => statusMeta(data.balance), [data.balance]);

  const totalTx = data.ledger?.length || 0;
  const latest = data.ledger?.[0];

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("smart_customer_shop");
    window.location.href = "/";
  };

  const backToShops = () => {
    navigate("/my-shops");
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-4 py-5">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <Store className="h-4 w-4" />
                {data.shop?.shopName || selectedShop?.shopName || "Shop"}
              </div>

              <div className="mt-5 text-sm text-white/70">Current Balance</div>

              <div className={`mt-2 text-5xl font-black ${meta.tone}`}>
                ₹{Math.abs(data.balance)}
              </div>

              <div className="mt-3 text-sm text-white/75">{meta.desc}</div>
              <div className="mt-2 text-sm text-white/60">
                {user?.name || "Customer"} {user?.phone ? `• ${user.phone}` : ""}
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
                onClick={backToShops}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4" />
                My Shops
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

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <SummaryCard
            title="Transactions"
            value={totalTx}
            tone="blue"
            icon={<Wallet className="h-5 w-5" />}
          />

          <SummaryCard
            title="Latest Entry"
            value={latest ? `₹${latest.amount}` : "—"}
            tone="green"
            icon={<BadgeIndianRupee className="h-5 w-5" />}
          />

          <SummaryCard
            title="Last Activity"
            value={
              latest
                ? new Date(latest.createdAt).toLocaleDateString()
                : "No activity"
            }
            tone="slate"
            icon={<CalendarDays className="h-5 w-5" />}
          />
        </div>

        {latest ? (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
              <Clock3 className="h-4 w-4" />
              Latest Activity
            </div>

            <div className="mt-3 text-lg font-bold text-slate-900">
              {latest.type === "PAYMENT" ? "Payment Received" : "Udhaar Added"}
            </div>

            <div className="mt-2 text-sm text-slate-500">
              {new Date(latest.createdAt).toLocaleString()}
            </div>
          </div>
        ) : null}

        {err ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-8">
          <div className="mb-4 text-2xl font-black text-slate-900">
            Transaction History
          </div>

          {!data.ledger?.length ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-500 shadow-sm">
              No transaction history yet.
            </div>
          ) : (
            <div className="space-y-4">
              {data.ledger.map((tx) => (
                <TxCard key={tx._id} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}