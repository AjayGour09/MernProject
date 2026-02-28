import { useEffect, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { StockAPI } from "../../services/stock.api";

export default function Stock() {
  const [tab, setTab] = useState("LOW"); // LOW | ALL
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // add product form
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState("");
  const [minStock, setMinStock] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data = tab === "LOW" ? await StockAPI.low() : await StockAPI.list(search);
      setItems(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [tab]);

  const addProduct = async () => {
    setErr("");
    const n = name.trim();
    const q = qty === "" ? 0 : Number(qty);
    const ms = minStock === "" ? 0 : Number(minStock);

    console.log("[Stock] addProduct", { n, unit, q, ms });

    if (!n) return setErr("Product name required");
    if (!Number.isFinite(q) || q < 0) return setErr("Qty >= 0");
    if (!Number.isFinite(ms) || ms < 0) return setErr("MinStock >= 0");

    try {
      await StockAPI.add({ name: n, unit: unit.trim(), qty: q, minStock: ms });
      setName(""); setUnit("pcs"); setQty(""); setMinStock("");
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const changeStock = async (productId, change) => {
    setErr("");
    console.log("[Stock] changeStock", { productId, change });

    try {
      await StockAPI.update({ productId, change, reason: change > 0 ? "IN" : "OUT" });
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <>
      <Container
        title="Stock"
        right={
          <div className="flex gap-2">
            <button
              onClick={() => setTab("LOW")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                tab === "LOW" ? "bg-black text-white" : "border bg-white"
              }`}
            >
              Low
            </button>
            <button
              onClick={() => setTab("ALL")}
              className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                tab === "ALL" ? "bg-black text-white" : "border bg-white"
              }`}
            >
              All
            </button>
          </div>
        }
      >
        <div className="rounded-2xl bg-white p-4 shadow">
          {tab === "ALL" ? (
            <>
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Search product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={load}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                🔍 Search
              </button>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Low stock = <b>qty ≤ minStock</b> (product-wise)
            </p>
          )}

          <div className="mt-4 rounded-2xl border p-4">
            <div className="text-base font-bold">➕ Add Product</div>

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Name (Maggi)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Unit (pcs/kg)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Min Stock"
                inputMode="numeric"
                value={minStock}
                onChange={(e) => setMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </div>

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Starting Qty"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />

            <button
              onClick={addProduct}
              className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
            >
              ✅ Save Product
            </button>

            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {items.map((p) => (
            <div key={p._id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">{p.name}</div>
                  <div className="text-sm text-gray-600">
                    Unit: {p.unit} • Min: {p.minStock}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Qty</div>
                  <div className="text-2xl font-extrabold">
                    {p.qty}
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => changeStock(p._id, +1)}
                  className="rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
                >
                  +1 Add
                </button>
                <button
                  onClick={() => changeStock(p._id, -1)}
                  className="rounded-2xl border py-3 font-semibold active:scale-[0.99]"
                >
                  -1 Sold
                </button>
              </div>
            </div>
          ))}

          {!loading && items.length === 0 ? (
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