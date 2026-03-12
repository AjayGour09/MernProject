import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopAPI } from "../../services/shop.api";
import { AuthService } from "../../services/auth";

export default function MyShops() {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shops, setShops] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = await ShopAPI.list();
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

  const createShop = async () => {
    setErr("");

    if (!shopName.trim()) {
      return setErr("Shop name required");
    }

    try {
      await ShopAPI.create({
        shopName: shopName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      setShopName("");
      setPhone("");
      setAddress("");

      await load();
    } catch (e) {
      setErr(e.message || "Create shop failed");
    }
  };

  const openShop = (shop) => {
    AuthService.setSelectedShop(shop);
    navigate("/", { replace: true });
  };

  const logout = () => {
    AuthService.logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-5 shadow ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-gray-500">
                Smart Kirana
              </div>
              <div className="mt-1 text-2xl font-extrabold text-gray-900">
                My Shops
              </div>
              <div className="mt-1 text-sm text-gray-500">
                {user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-2xl border px-4 py-2 text-sm font-semibold"
            >
              Logout
            </button>
          </div>

          <div className="mt-5 rounded-2xl border p-4">
            <div className="text-base font-bold">➕ Create Shop</div>

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button
              onClick={createShop}
              className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
            >
              Create Shop
            </button>

            {err ? (
              <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-5 shadow ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">Available Shops</div>

          {loading ? <div className="mt-3 text-sm text-gray-600">Loading...</div> : null}

          <div className="mt-3 space-y-3">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="rounded-2xl border p-4"
              >
                <div className="text-lg font-bold">{shop.shopName}</div>
                <div className="mt-1 text-sm text-gray-500">{shop.phone}</div>
                <div className="text-sm text-gray-500">{shop.address}</div>

                <button
                  onClick={() => openShop(shop)}
                  className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
                >
                  Open Shop
                </button>
              </div>
            ))}

            {!loading && shops.length === 0 ? (
              <div className="rounded-2xl border p-4 text-sm text-gray-600">
                No shops yet. Pehle shop create karo.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}