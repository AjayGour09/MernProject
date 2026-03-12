import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { StockAPI } from "../../services/stock.api";
import { AuthService } from "../../services/auth";

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold ${
        active ? "bg-black text-white" : "border bg-white text-gray-900"
      }`}
    >
      {children}
    </button>
  );
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

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data =
        tab === "LOW" ? await StockAPI.low() : await StockAPI.list(search);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load");
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
    if (!Number.isFinite(q) || q < 0) return setErr("Qty >= 0 hona chahiye");
    if (!Number.isFinite(ms) || ms < 0) return setErr("MinStock >= 0 hona chahiye");

    try {
      await StockAPI.add({ name: n, unit: u, qty: q, minStock: ms });
      setName("");
      setUnit("pcs");
      setQty("");
      setMinStock("");
      setShowAdd(false);
      await load();
    } catch (e) {
      setErr(e.message || "Failed to add product");
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
        title={`Stock • ${shop?.shopName || ""}`}
        right={
          <div className="flex gap-2">
            <Pill active={tab === "LOW"} onClick={() => setTab("LOW")}>
              Low
            </Pill>
            <Pill active={tab === "ALL"} onClick={() => setTab("ALL")}>
              All
            </Pill>
          </div>
        }
      >
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          {tab === "ALL" ? (
            <input
              className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Search product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          ) : (
            <div className="text-sm text-gray-600">
              Low stock = <b>qty ≤ minStock</b>
            </div>
          )}

          <div className="mt-4 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold">➕ Add Product</div>
              <button
                onClick={() => setShowAdd((s) => !s)}
                className="rounded-xl border px-3 py-2 text-sm font-semibold"
              >
                {showAdd ? "Hide" : "Open"}
              </button>
            </div>

            {showAdd ? (
              <>
                <input
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <option value="pcs">pcs</option>
                    <option value="kg">kg</option>
                    <option value="ltr">ltr</option>
                    <option value="pack">pack</option>
                  </select>

                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                    placeholder="Min Stock"
                    inputMode="numeric"
                    value={minStock}
                    onChange={(e) =>
                      setMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                  />
                </div>

                <input
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Starting Qty"
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) =>
                    setQty(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />

                <button
                  onClick={addProduct}
                  className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
                >
                  ✅ Save Product
                </button>
              </>
            ) : null}
          </div>

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {computed.map((p) => (
            <div
              key={p._id}
              className={`rounded-2xl bg-white p-4 shadow ring-1 ring-black/5 ${
                p.isLow ? "ring-2 ring-red-500" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-bold truncate">{p.name}</div>
                    {p.isLow ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                        LOW
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-gray-600">
                    Unit: {p.unit} • Min: {p.minStock}
                    {p.need > 0 ? (
                      <span className="ml-2 text-xs font-semibold text-red-700">
                        Need: {p.need} {p.unit}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">Qty</div>
                  <div className="text-2xl font-extrabold">{p.qty}</div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <button
                  onClick={() => quickUpdate(p, -1, "Sold")}
                  className="rounded-xl border py-3 text-center font-bold"
                >
                  -1
                </button>
                <button
                  onClick={() => quickUpdate(p, -5, "Sold")}
                  className="rounded-xl border py-3 text-center font-bold"
                >
                  -5
                </button>
                <button
                  onClick={() => quickUpdate(p, +1, "Restock")}
                  className="rounded-xl bg-black py-3 text-center font-bold text-white"
                >
                  +1
                </button>
                <button
                  onClick={() => quickUpdate(p, +5, "Restock")}
                  className="rounded-xl bg-black py-3 text-center font-bold text-white"
                >
                  +5
                </button>
              </div>
            </div>
          ))}

          {!loading && computed.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow">
              No products found.
            </div>
          ) : null}
        </div>
      </Container>

      <BottomNav />
    </>
  );
}