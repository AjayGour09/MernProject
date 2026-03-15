import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Store, MapPin, Phone, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Smart Kirana
                </div>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  My Shops
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  {user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}
                </p>
              </div>

              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="mt-8 rounded-[28px] bg-[#0f172a] p-5 text-white">
              <div className="text-sm font-semibold text-white/70">Create shop</div>

              <div className="mt-4 space-y-3">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                  placeholder="Shop name"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />

                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <button
                  onClick={createShop}
                  disabled={creating}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-gray-100 disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  {creating ? "Creating..." : "Create Shop"}
                </button>
              </div>
            </div>

            {err ? (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}
          </div>

          <div className="rounded-[30px] border border-black/5 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Available
                </div>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                  Your shops
                </h2>
              </div>

              <div className="rounded-2xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
                {shops.length} shops
              </div>
            </div>

            {loading ? (
              <div className="mt-6 text-sm text-gray-600">Loading...</div>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              {shops.map((shop) => (
                <div
                  key={shop._id}
                  className="group rounded-[28px] border border-gray-200 bg-[#fbfcfe] p-5 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white">
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
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
                  >
                    Open Shop
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                </div>
              ))}
            </div>

            {!loading && shops.length === 0 ? (
              <div className="mt-6 rounded-[28px] border border-dashed border-gray-300 bg-gray-50 p-8 text-center text-sm text-gray-500">
                No shops yet. Pehle shop create karo.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}