import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  LogOut,
  Store,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { ShopAPI } from "../../services/shop.api";
import { AuthService } from "../../services/auth";

export default function AdminMyShops() {
  const navigate = useNavigate();
  const user = AuthService.getUser();

  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shops, setShops] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

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
      setErr("Shop name required");
      return;
    }

    setCreating(true);
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
    } finally {
      setCreating(false);
    }
  };

  const openShop = (shop) => {
    AuthService.setSelectedShop(shop);
    navigate("/dashboard", { replace: true });
  };

  const logout = () => {
    AuthService.logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="rounded-[28px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-white/70">
                    Smart Kirana
                  </div>
                  <div className="mt-2 text-3xl font-extrabold tracking-tight">
                    My Shops
                  </div>
                  <div className="mt-2 text-sm text-white/70">
                    {user?.name || "Admin"}
                  </div>
                  <div className="text-sm text-white/60">
                    {user?.email || ""}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-[28px] bg-white p-5 ring-1 ring-black/5">
              <div className="text-base font-bold text-gray-900">
                Create New Shop
              </div>
              <div className="mt-1 text-sm text-gray-500">
                Apni nayi shop add karo aur dashboard se manage karo.
              </div>

              <div className="mt-4 space-y-3">
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  placeholder="Shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />

                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <input
                  className="w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <button
                  onClick={createShop}
                  disabled={creating}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {creating ? "Creating..." : "Create Shop"}
                </button>
              </div>

              {err ? (
                <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {err}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Available Shops
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  Open your store
                </h2>
              </div>

              <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                {shops.length} shops
              </div>
            </div>

            {loading ? (
              <div className="mt-6 text-sm text-gray-500">Loading...</div>
            ) : null}

            {!loading && shops.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
                No shops yet. Pehle apni first shop create karo.
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className="group rounded-[28px] bg-[#fbfcfe] p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    <Store className="h-5 w-5" />
                  </div>

                  <h3 className="mt-4 text-xl font-black tracking-tight text-gray-900">
                    {shop.shopName}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{shop.phone || "No phone"}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4" />
                      <span>{shop.address || "No address"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openShop(shop)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
                  >
                    Open Shop
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}