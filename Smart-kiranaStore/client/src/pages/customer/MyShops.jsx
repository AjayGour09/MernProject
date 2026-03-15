import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

export default function MyShops() {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const [shops, setShops] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await apiGet(`/customer-shops`);
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
    window.location.href = "/customer/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-5 shadow ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900">
              My Shops
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

        {loading ? <div className="mt-4 text-sm text-gray-600">Loading...</div> : null}
        {err ? (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {shops.map((s) => (
            <div key={s.shopId} className="rounded-2xl border p-4">
              <div className="text-base font-bold text-gray-900">{s.shopName}</div>
              <div className="mt-1 text-sm text-gray-500">
                {s.balance > 0
                  ? `Baki ₹${s.balance}`
                  : s.balance < 0
                  ? `Advance ₹${Math.abs(s.balance)}`
                  : "Clear"}
              </div>

              <button
                onClick={() => openShop(s)}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
              >
                Open
              </button>
            </div>
          ))}

          {!loading && shops.length === 0 ? (
            <div className="rounded-2xl border p-4 text-sm text-gray-600">
              No shops linked yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
8}