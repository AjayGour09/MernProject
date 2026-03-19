import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Store,
  ArrowLeft,
  LogOut,
  Wallet,
  Clock3,
  ReceiptText,
  CircleCheckBig,
  CircleDollarSign,
} from "lucide-react";
import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function formatBalance(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      value: `₹${b}`,
      valueCls: "text-red-600",
      softBg: "bg-red-50",
      badge: "bg-red-50 text-red-700",
      icon: "due",
      helper: "Aapko itna amount dena baki hai.",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      valueCls: "text-green-600",
      softBg: "bg-green-50",
      badge: "bg-green-50 text-green-700",
      icon: "advance",
      helper: "Aapke account me advance balance hai.",
    };
  }

  return {
    label: "Clear",
    value: "₹0",
    valueCls: "text-gray-700",
    softBg: "bg-gray-50",
    badge: "bg-gray-100 text-gray-700",
    icon: "clear",
    helper: "Abhi koi pending amount nahi hai.",
  };
}

function StatusIcon({ type }) {
  if (type === "due") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <Wallet className="h-5 w-5" />
      </div>
    );
  }

  if (type === "advance") {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        <CircleDollarSign className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-700">
      <CircleCheckBig className="h-5 w-5" />
    </div>
  );
}

function EntryTypeBadge({ type }) {
  const isUdhaar = type === "UDAAR";

  return (
    <div
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        isUdhaar ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isUdhaar ? "Udhaar" : "Payment"}
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

  const [shop, setShop] = useState(null);
  const [balance, setBalance] = useState(0);
  const [ledger, setLedger] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const balanceUI = formatBalance(balance);

  const load = async () => {
    if (!selectedShop?.shopId) {
      navigate("/my-shops", { replace: true });
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const data = await apiGet(
        `/customer-account?shopId=${selectedShop.shopId}`
      );
      setShop(data.shop || null);
      setBalance(Number(data.balance || 0));
      setLedger(Array.isArray(data.ledger) ? data.ledger : []);
    } catch (e) {
      setErr(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("smart_customer_shop");
    window.location.href = "/";
  };

  const backToShops = () => {
    navigate("/my-shops");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-5">
      <div className="mx-auto max-w-md">
        <div className="rounded-[30px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-white/70">
                Smart Kirana
              </div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                My Account
              </div>
              <div className="mt-2 text-sm text-white/70">
                {user?.name || "Customer"}
              </div>
              <div className="text-sm text-white/60">{user?.phone || ""}</div>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <button
            onClick={backToShops}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Shops
          </button>
        </div>

        {shop ? (
          <div className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                <Store className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Selected Shop
                </div>
                <div className="mt-1 text-xl font-extrabold tracking-tight text-gray-900">
                  {shop.shopName}
                </div>
                {shop?.address ? (
                  <div className="mt-1 text-sm text-gray-500">
                    {shop.address}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={`mt-4 rounded-[28px] p-5 shadow-sm ring-1 ring-black/5 ${balanceUI.softBg}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wide text-gray-500">
                Current Status
              </div>
              <div className={`mt-2 text-4xl font-extrabold ${balanceUI.valueCls}`}>
                {balanceUI.value}
              </div>
              <div className="mt-2 text-sm text-gray-600">{balanceUI.helper}</div>
            </div>

            <div className="shrink-0">
              <StatusIcon type={balanceUI.icon} />
            </div>
          </div>

          <div
            className={`mt-4 inline-flex rounded-full px-3 py-1 text-xs font-bold ${balanceUI.badge}`}
          >
            {balanceUI.label}
          </div>
        </div>

        {loading ? (
          <div className="mt-4 text-sm text-gray-500">Loading...</div>
        ) : null}

        {err ? (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
            <ReceiptText className="h-5 w-5" />
            My History
          </div>

          {!loading && ledger.length === 0 ? (
            <div className="rounded-[28px] bg-white p-5 text-sm text-gray-500 shadow-sm ring-1 ring-black/5">
              No history yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {ledger.map((t) => (
              <div
                key={t._id}
                className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <EntryTypeBadge type={t.type} />

                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                      <Clock3 className="h-4 w-4" />
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div
                      className={`mt-1 text-2xl font-extrabold ${
                        t.type === "UDAAR" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{t.amount}
                    </div>
                  </div>
                </div>

                {Array.isArray(t.items) && t.items.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </div>

                    <div className="mt-3 space-y-2">
                      {t.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-black/5"
                        >
                          <div className="min-w-0 text-sm text-gray-800">
                            <span className="font-medium">{it.name}</span>
                            <span className="text-gray-500"> × {it.qty}</span>
                          </div>

                          <div className="shrink-0 text-sm font-bold text-gray-900">
                            ₹{it.total}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {t.note ? (
                  <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-black/5">
                    {t.note}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}