import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function formatBalance(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      value: `₹${b}`,
      cls: "text-red-600",
      card: "bg-red-50",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      cls: "text-green-600",
      card: "bg-green-50",
    };
  }

  return {
    label: "Status",
    value: "Clear",
    cls: "text-gray-700",
    card: "bg-gray-50",
  };
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
      const data = await apiGet(`/customer-account?shopId=${selectedShop.shopId}`);
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
    window.location.href = "/customer/login";
  };

  const backToShops = () => {
    navigate("/my-shops");
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-5">
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
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
              className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-100"
            >
              Logout
            </button>
          </div>

          <button
            onClick={backToShops}
            className="mt-4 w-full rounded-2xl border border-white/15 bg-white/10 py-3 text-sm font-bold text-white transition hover:bg-white/15"
          >
            ← Back to My Shops
          </button>
        </div>

        {shop ? (
          <div className="mt-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Selected Shop
            </div>
            <div className="mt-2 text-xl font-extrabold text-gray-900">
              {shop.shopName}
            </div>
          </div>
        ) : null}

        <div className={`mt-4 rounded-[28px] p-5 shadow-sm ring-1 ring-black/5 ${balanceUI.card}`}>
          <div className="text-xs uppercase tracking-wide text-gray-500">
            {balanceUI.label}
          </div>
          <div className={`mt-2 text-4xl font-extrabold ${balanceUI.cls}`}>
            {balanceUI.value}
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

        <div className="mt-5 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">My History</div>

          <div className="mt-4 space-y-4">
            {ledger.map((t) => (
              <div
                key={t._id}
                className="rounded-3xl bg-[#fbfcfe] p-4 ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {t.type === "UDAAR" ? "➕ Udhaar" : "✅ Payment"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="text-xl font-extrabold text-gray-900">
                      ₹{t.amount}
                    </div>
                  </div>
                </div>

                {Array.isArray(t.items) && t.items.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </div>

                    <div className="mt-2 space-y-2">
                      {t.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="text-gray-800">
                            {it.name} × {it.qty}
                          </div>
                          <div className="font-semibold text-gray-900">
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

            {!loading && ledger.length === 0 ? (
              <div className="rounded-3xl bg-gray-50 p-4 text-sm text-gray-500 ring-1 ring-black/5">
                No history yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}