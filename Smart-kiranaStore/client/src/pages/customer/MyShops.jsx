import { useEffect, useState } from "react";
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
      badge: "bg-red-50 text-red-700",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      cls: "text-green-600",
      badge: "bg-green-50 text-green-700",
    };
  }

  return {
    label: "Clear",
    value: "₹0",
    cls: "text-gray-700",
    badge: "bg-gray-100 text-gray-700",
  };
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
                My Shops
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

          <div className="mt-4 rounded-3xl bg-white/10 p-4">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Linked Shops
            </div>
            <div className="mt-1 text-4xl font-extrabold">{shops.length}</div>
            <div className="mt-2 text-sm text-white/70">
              Yahan se apni shop select karke account details dekh sakte ho.
            </div>
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
          <div className="mb-3 text-base font-bold text-gray-900">
            Available Shops
          </div>

          {!loading && shops.length === 0 ? (
            <div className="rounded-[28px] bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No shops linked yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {shops.map((s) => {
              const balanceUI = formatBalance(s.balance);

              return (
                <div
                  key={s.shopId}
                  className="rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xl font-extrabold tracking-tight text-gray-900">
                        {s.shopName}
                      </div>

                      <div
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${balanceUI.badge}`}
                      >
                        {balanceUI.label}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className={`mt-1 text-2xl font-extrabold ${balanceUI.cls}`}>
                        {balanceUI.value}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openShop(s)}
                    className="mt-5 w-full rounded-2xl bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-900"
                  >
                    Open Shop
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}