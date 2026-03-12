import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function formatBalance(balance) {
  const b = Number(balance || 0);
  if (b > 0) return { label: "Baki", value: `₹${b}`, cls: "text-red-700" };
  if (b < 0) return { label: "Advance", value: `₹${Math.abs(b)}`, cls: "text-green-700" };
  return { label: "Status", value: "Clear", cls: "text-gray-700" };
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
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">
                My Account
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {user?.name || "Customer"}
              </div>
              <div className="text-sm text-gray-500">{user?.phone || ""}</div>
            </div>

            <button
              onClick={logout}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
          </div>

          <button
            onClick={backToShops}
            className="mt-4 w-full rounded-2xl border py-3 text-sm font-semibold"
          >
            ← Back to My Shops
          </button>

          {shop ? (
            <div className="mt-4 rounded-2xl border p-4">
              <div className="text-xs text-gray-500">Shop</div>
              <div className="text-lg font-bold text-gray-900">{shop.shopName}</div>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border p-4">
            <div className="text-xs text-gray-500">{balanceUI.label}</div>
            <div className={`mt-1 text-4xl font-extrabold ${balanceUI.cls}`}>
              {balanceUI.value}
            </div>
          </div>

          {loading ? <div className="mt-3 text-sm text-gray-600">Loading...</div> : null}
          {err ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 shadow ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">My History</div>

          <div className="mt-3 space-y-3">
            {ledger.map((t) => (
              <div key={t._id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">
                    {t.type === "UDAAR" ? "➕ Udhaar" : "✅ Payment"}
                  </div>
                  <div className="text-lg font-extrabold">₹{t.amount}</div>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {new Date(t.createdAt).toLocaleString()}
                </div>

                {Array.isArray(t.items) && t.items.length > 0 ? (
                  <div className="mt-3 rounded-2xl border p-3">
                    <div className="text-xs font-bold text-gray-700">Items</div>
                    <div className="mt-2 space-y-1">
                      {t.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="text-gray-800">
                            {it.name} × {it.qty}
                          </div>
                          <div className="font-semibold">₹{it.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {t.note ? (
                  <div className="mt-2 text-sm text-gray-700">{t.note}</div>
                ) : null}
              </div>
            ))}

            {!loading && ledger.length === 0 ? (
              <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600">
                No history yet.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}