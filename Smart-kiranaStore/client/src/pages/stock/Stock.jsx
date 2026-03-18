import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { StockAPI } from "../../services/stock.api";
import { AuthService } from "../../services/auth";

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-black text-white"
          : "bg-white text-gray-700 ring-1 ring-black/5 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function unitOptions() {
  return ["pcs", "kg", "ltr", "pack"];
}

function calcNeed(qty, minStock) {
  const q = Number(qty || 0);
  const ms = Number(minStock || 0);
  const need = ms - q;
  return need > 0 ? need : 0;
}

export default function Stock() {
  const navigate = useNavigate();
  const shop = AuthService.getSelectedShop();

  const [tab, setTab] = useState("LOW");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const data =
        tab === "LOW" ? await StockAPI.low() : await StockAPI.list(search);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shop?._id) {
      navigate("/shops", { replace: true });
      return;
    }
    load();
  }, [shop?._id, tab]);

  useEffect(() => {
    if (tab !== "ALL") return;
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
  }, [search, tab]);

  const addProduct = async () => {
    setErr("");

    const n = name.trim();
    const u = unit.trim() || "pcs";
    const q = qty === "" ? 0 : Number(qty);
    const ms = minStock === "" ? 0 : Number(minStock);

    if (!n) return setErr("Product name required");
    if (!Number.isFinite(q) || q < 0) return setErr("Qty 0 ya usse zyada hona chahiye");
    if (!Number.isFinite(ms) || ms < 0) return setErr("Min stock 0 ya usse zyada hona chahiye");

    setSaving(true);
    try {
      await StockAPI.add({
        name: n,
        unit: u,
        qty: q,
        minStock: ms,
      });

      setName("");
      setUnit("pcs");
      setQty("");
      setMinStock("");
      setShowAdd(false);

      await load();
    } catch (e) {
      setErr(e.message || "Product add failed");
    } finally {
      setSaving(false);
    }
  };

  const quickUpdate = async (product, delta, reasonText) => {
    setErr("");

    try {
      await StockAPI.update({
        productId: product._id,
        change: delta,
        reason: reasonText,
      });

      await load();
    } catch (e) {
      setErr(e.message || "Update failed");
    }
  };

  const computed = useMemo(() => {
    return items.map((p) => ({
      ...p,
      need: calcNeed(p.qty, p.minStock),
      isLow: Number(p.qty || 0) <= Number(p.minStock || 0),
    }));
  }, [items]);

  return (
    <>
      <Container
        title="Stock"
        subtitle={shop?.shopName || "Smart Kirana"}
        right={
          <div className="flex gap-2">
            <TabBtn active={tab === "LOW"} onClick={() => setTab("LOW")}>
              Low
            </TabBtn>
            <TabBtn active={tab === "ALL"} onClick={() => setTab("ALL")}>
              All
            </TabBtn>
          </div>
        }
      >
        <div className="rounded-[30px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/70">Stock Overview</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {computed.length}
          </div>
          <div className="mt-2 text-sm text-white/70">
            {tab === "LOW" ? "Low stock products" : "All available products"}
          </div>

          {tab === "ALL" ? (
            <div className="mt-4">
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/55 outline-none"
                placeholder="Search product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
              Low stock ka matlab: <b>qty ≤ minStock</b>
            </div>
          )}
        </div>

        <div className="rounded-[30px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-base font-bold text-gray-900">Add Product</div>
              <div className="mt-1 text-sm text-gray-500">
                Naya product inventory me add karo.
              </div>
            </div>

            <button
              onClick={() => setShowAdd((s) => !s)}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-900"
            >
              {showAdd ? "Close" : "Open"}
            </button>
          </div>

          {showAdd ? (
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                >
                  {unitOptions().map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Min stock"
                  inputMode="numeric"
                  value={minStock}
                  onChange={(e) =>
                    setMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />
              </div>

              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Starting qty"
                inputMode="numeric"
                value={qty}
                onChange={(e) =>
                  setQty(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <button
                onClick={addProduct}
                disabled={saving}
                className="w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Product"}
              </button>
            </div>
          ) : null}

          {err ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 text-base font-bold text-gray-900">
            Product List
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && computed.length === 0 ? (
            <div className="rounded-[28px] bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No products found.
            </div>
          ) : null}

          <div className="space-y-4">
            {computed.map((p) => (
              <div
                key={p._id}
                className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-xl font-extrabold tracking-tight text-gray-900">
                        {p.name}
                      </div>

                      {p.isLow ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          LOW
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-1 text-sm text-gray-500">
                      Unit: {p.unit} • Min stock: {p.minStock}
                    </div>

                    {p.need > 0 ? (
                      <div className="mt-3 inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                        Need {p.need} {p.unit}
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Stock okay
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Qty</div>
                    <div
                      className={`mt-1 text-3xl font-extrabold ${
                        p.isLow ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {p.qty}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2">
                  <button
                    onClick={() => quickUpdate(p, -1, "Sold")}
                    className="rounded-2xl border py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50"
                  >
                    -1
                  </button>

                  <button
                    onClick={() => quickUpdate(p, -5, "Sold")}
                    className="rounded-2xl border py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50"
                  >
                    -5
                  </button>

                  <button
                    onClick={() => quickUpdate(p, +1, "Restock")}
                    className="rounded-2xl bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-gray-900"
                  >
                    +1
                  </button>

                  <button
                    onClick={() => quickUpdate(p, +5, "Restock")}
                    className="rounded-2xl bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-gray-900"
                  >
                    +5
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}