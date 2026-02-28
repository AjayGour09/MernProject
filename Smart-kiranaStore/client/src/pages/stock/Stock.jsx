// client/src/pages/Stock/Stock.jsx
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

  // custom update
  const [selected, setSelected] = useState(null); // product object
  const [change, setChange] = useState(""); // string but will convert to number
  const [reason, setReason] = useState("");

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const data =
        tab === "LOW" ? await StockAPI.low() : await StockAPI.list(search);
      setItems(data);
    } catch (e) {
      setErr(e.message || "Failed to load");
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
    const u = unit.trim() || "pcs";
    const q = qty === "" ? 0 : Number(qty);
    const ms = minStock === "" ? 0 : Number(minStock);

    console.log("[Stock] addProduct", { n, u, q, ms });

    if (!n) return setErr("Product name required");
    if (!Number.isFinite(q) || q < 0) return setErr("Qty >= 0 hona chahiye");
    if (!Number.isFinite(ms) || ms < 0)
      return setErr("MinStock >= 0 hona chahiye");

    try {
      await StockAPI.add({ name: n, unit: u, qty: q, minStock: ms });
      setName("");
      setUnit("pcs");
      setQty("");
      setMinStock("");
      await load();
    } catch (e) {
      setErr(e.message || "Failed to add product");
    }
  };

  const openUpdate = (product) => {
    setSelected(product);
    setChange("");
    setReason("");
  };

  const setIncoming = () => {
    const v = prompt("Kitna stock aaya? (example: 20)");
    if (v === null) return; // user cancelled
    const num = Number(String(v).replace(/\D/g, ""));
    if (!Number.isFinite(num) || num <= 0) return alert("Valid number dalo");
    setChange(String(num)); // positive
    setReason("IN");
  };

  const setOutgoing = () => {
    const v = prompt("Kitna bik gaya? (example: 12)");
    if (v === null) return; // user cancelled
    const num = Number(String(v).replace(/\D/g, ""));
    if (!Number.isFinite(num) || num <= 0) return alert("Valid number dalo");
    setChange(String(-num)); // negative
    setReason("OUT");
  };

  const saveUpdate = async () => {
    setErr("");
    if (!selected?._id) return setErr("Product select karo");

    const ch = Number(change);
    console.log("[Stock] custom update", {
      productId: selected._id,
      change: ch,
      reason,
    });

    if (!Number.isFinite(ch) || ch === 0) return setErr("Change set karo");

    try {
      await StockAPI.update({
        productId: selected._id,
        change: ch,
        reason: reason.trim(),
      });
      setSelected(null);
      await load();
    } catch (e) {
      setErr(e.message || "Failed to update stock");
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
        {/* Top panel */}
        <div className="rounded-2xl bg-white p-4 shadow">
          {tab === "ALL" ? (
            <>
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Search product (Maggi / Sugar)"
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

          {/* Add product */}
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
                placeholder="Unit (pcs/kg/ltr)"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />

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
              className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
            >
              ✅ Save Product
            </button>
          </div>

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        {/* List */}
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
                  <div className="text-2xl font-extrabold">{p.qty}</div>
                </div>
              </div>

              <button
                onClick={() => openUpdate(p)}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                🔁 Update Stock
              </button>
            </div>
          ))}

          {!loading && items.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow">
              No products found.
            </div>
          ) : null}
        </div>

        {/* Custom Update Panel */}
        {selected ? (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold">{selected.name}</div>
                <div className="text-sm text-gray-600">
                  Current: <b>{selected.qty}</b> {selected.unit} • Min:{" "}
                  {selected.minStock}
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border px-3 py-2 text-sm font-semibold"
              >
                ✖ Close
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={setIncoming}
                className="rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                ➕ Stock Aaya
              </button>

              <button
                onClick={setOutgoing}
                className="rounded-2xl border py-3 font-semibold active:scale-[0.99]"
              >
                ➖ Bik Gaya
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Change (auto set)"
                value={change}
                onChange={(e) => setChange(e.target.value)}
              />
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={80}
              />
            </div>

            <button
              onClick={saveUpdate}
              className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
            >
              ✅ Save Update
            </button>

            <p className="mt-2 text-xs text-gray-500">
              Tip: Stock Aaya = +ve, Bik Gaya = -ve (system auto handle karta hai)
            </p>
          </div>
        ) : null}
      </Container>

      <BottomNav />
    </>
  );
}