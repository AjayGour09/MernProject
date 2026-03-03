// client/src/pages/Stock/Stock.jsx
import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { StockAPI } from "../../services/stock.api";

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition ${
        active ? "bg-black text-white" : "border bg-white"
      }`}
    >
      {children}
    </button>
  );
}

function SmallBtn({ onClick, children, variant = "light" }) {
  const base =
    "rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition";
  const cls =
    variant === "dark"
      ? `${base} bg-black text-white`
      : variant === "green"
      ? `${base} bg-green-600 text-white`
      : `${base} border bg-white text-gray-900`;
  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export default function Stock() {
  const [tab, setTab] = useState("LOW"); // LOW | ALL
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    totalQty: 0,
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // add product form
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState("");
  const [minStock, setMinStock] = useState("");
  const [category, setCategory] = useState("");
  const [barcode, setBarcode] = useState("");

  // custom update panel
  const [selected, setSelected] = useState(null);
  const [change, setChange] = useState("");
  const [reason, setReason] = useState("");

  const reorderNeed = (p) => {
    const q = Number(p.qty || 0);
    const ms = Number(p.minStock || 0);
    const buffer = 2; // simple buffer
    const need = ms - q + buffer;
    return need > 0 ? need : 0;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [items, search]);

  // ✅ Reorder list from current items
  const reorderList = useMemo(() => {
    const arr = items
      .map((p) => ({
        ...p,
        need: reorderNeed(p),
        isLow: Number(p.qty || 0) <= Number(p.minStock || 0),
      }))
      .filter((p) => p.need > 0 || p.isLow)
      .sort((a, b) => (b.need || 0) - (a.need || 0));
    return arr;
  }, [items]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      // ✅ For LOW tab: backend low list
      // ✅ For ALL tab: backend list(search)
      const data =
        tab === "LOW" ? await StockAPI.low() : await StockAPI.list(search);

      const list = Array.isArray(data) ? data : [];
      setItems(list);

      // summary (client-side fallback)
      const totalProducts = list.length;
      const lowStockCount = list.filter(
        (p) => Number(p.qty || 0) <= Number(p.minStock || 0)
      ).length;
      const totalQty = list.reduce((s, p) => s + Number(p.qty || 0), 0);

      setSummary({ totalProducts, lowStockCount, totalQty });
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  // load on tab change
  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [tab]);

  // auto load on search (ALL tab)
  useEffect(() => {
    if (tab !== "ALL") return;
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, tab]);

  const resetAddForm = () => {
    setName("");
    setUnit("pcs");
    setQty("");
    setMinStock("");
    setCategory("");
    setBarcode("");
  };

  const addProduct = async () => {
    setErr("");
    const n = name.trim();
    const u = unit.trim() || "pcs";
    const q = qty === "" ? 0 : Number(qty);
    const ms = minStock === "" ? 0 : Number(minStock);

    if (!n) return setErr("Product name required");
    if (!Number.isFinite(q) || q < 0) return setErr("Qty >= 0 hona chahiye");
    if (!Number.isFinite(ms) || ms < 0)
      return setErr("MinStock >= 0 hona chahiye");

    try {
      await StockAPI.add({
        name: n,
        unit: u,
        qty: q,
        minStock: ms,
        category: category.trim(),
        barcode: barcode.trim(),
      });
      resetAddForm();
      setShowAdd(false);
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

  const quickChange = async (p, ch, r) => {
    setErr("");
    try {
      await StockAPI.update({ productId: p._id, change: ch, reason: r });
      await load();
    } catch (e) {
      setErr(e.message || "Failed to update stock");
    }
  };

  const setIncoming = () => {
    const v = prompt("Kitna stock aaya? (example: 20)");
    if (v === null) return;
    const num = Number(String(v).replace(/\D/g, ""));
    if (!Number.isFinite(num) || num <= 0) return alert("Valid number dalo");
    setChange(String(num));
    setReason("Restock");
  };

  const setOutgoing = () => {
    const v = prompt("Kitna bik gaya? (example: 12)");
    if (v === null) return;
    const num = Number(String(v).replace(/\D/g, ""));
    if (!Number.isFinite(num) || num <= 0) return alert("Valid number dalo");
    setChange(String(-num));
    setReason("Sold");
  };

  const saveUpdate = async () => {
    setErr("");
    if (!selected?._id) return setErr("Product select karo");

    const ch = Number(change);
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

  // ✅ WhatsApp reorder share
  const shareReorderWhatsApp = () => {
    if (!reorderList.length) return alert("Reorder list empty ✅");

    const lines = reorderList.slice(0, 50).map((p, idx) => {
      const need = p.need || 0;
      const u = p.unit || "pcs";
      return `${idx + 1}) ${p.name} - Need: ${need} ${u} (Qty:${p.qty}, Min:${p.minStock})`;
    });

    const msg =
      `🛒 Smart Kirana - Reorder List\n` +
      `Date: ${new Date().toLocaleDateString()}\n\n` +
      lines.join("\n") +
      `\n\n(Generated by Smart Kirana)`;

    // user will choose contact inside whatsapp
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ✅ Copy reorder list
  const copyReorder = async () => {
    if (!reorderList.length) return alert("Reorder list empty ✅");
    const text = reorderList
      .slice(0, 50)
      .map((p, i) => `${i + 1}) ${p.name} - ${p.need} ${p.unit}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    alert("Copied ✅");
  };

  // ✅ Export CSV (simple backup)
  const exportCSV = () => {
    const list = tab === "ALL" ? filtered : items;
    const rows = [
      ["name", "unit", "qty", "minStock", "category", "barcode"],
      ...list.map((p) => [
        p.name ?? "",
        p.unit ?? "",
        p.qty ?? 0,
        p.minStock ?? 0,
        p.category ?? "",
        p.barcode ?? "",
      ]),
    ];

    const csv = rows
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Container
        title="Stock"
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
        {/* ✅ Reorder List Card (Unique feature) */}
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-base font-extrabold">🛒 Reorder List</div>
              <div className="text-xs text-gray-500">
                Auto list: qty low ho to “need” calculate hota hai
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Items</div>
              <div className="text-2xl font-extrabold">{reorderList.length}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <SmallBtn variant="green" onClick={shareReorderWhatsApp}>
              📲 WhatsApp
            </SmallBtn>
            <SmallBtn onClick={copyReorder}>📋 Copy</SmallBtn>
            <SmallBtn onClick={exportCSV}>⬇️ CSV</SmallBtn>
            <SmallBtn onClick={load}>↻ Refresh</SmallBtn>
          </div>

          {/* show top 5 */}
          {reorderList.length ? (
            <div className="mt-3 space-y-2">
              {reorderList.slice(0, 5).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-2xl border p-3"
                >
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {p.qty} • Min: {p.minStock}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Need</div>
                    <div className="text-lg font-extrabold">
                      {p.need} {p.unit}
                    </div>
                  </div>
                </div>
              ))}
              {reorderList.length > 5 ? (
                <div className="text-xs text-gray-500">
                  Showing top 5 (WhatsApp me full list jayegi)
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border bg-gray-50 p-3 text-sm text-gray-600">
              ✅ All good! Abhi reorder ki need nahi hai.
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-sm font-bold">Stock Summary</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border p-3">
              <div className="text-xs text-gray-500">Products</div>
              <div className="text-xl font-extrabold">{summary.totalProducts}</div>
            </div>
            <div className="rounded-2xl border p-3">
              <div className="text-xs text-gray-500">Low</div>
              <div className="text-xl font-extrabold">{summary.lowStockCount}</div>
            </div>
            <div className="rounded-2xl border p-3">
              <div className="text-xs text-gray-500">Total Qty</div>
              <div className="text-xl font-extrabold">{summary.totalQty}</div>
            </div>
          </div>

          {tab === "ALL" ? (
            <div className="mt-4">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Search product (Maggi / Sugar)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-2 text-xs text-gray-500">Type to search (auto)</div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Low stock = <b>qty ≤ minStock</b>
            </p>
          )}
        </div>

        {/* Add Product */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-base font-bold">➕ Add Product</div>
            <SmallBtn onClick={() => setShowAdd((s) => !s)}>
              {showAdd ? "Hide" : "Open"}
            </SmallBtn>
          </div>

          {showAdd ? (
            <div className="mt-3 space-y-3">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Name (Maggi)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
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
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Starting Qty"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Category (optional)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Barcode/SKU (optional)"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                />
              </div>

              <SmallBtn variant="dark" onClick={addProduct}>
                ✅ Save Product
              </SmallBtn>
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-600">
              Clean screen ke liye form hide hai.
            </div>
          )}

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        {/* List */}
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {(tab === "ALL" ? filtered : items).map((p) => {
            const isLow = Number(p.qty || 0) <= Number(p.minStock || 0);
            const need = reorderNeed(p);

            return (
              <div key={p._id} className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold truncate">{p.name}</div>
                      {isLow ? (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-bold text-red-700">
                          LOW
                        </span>
                      ) : null}
                    </div>

                    <div className="text-sm text-gray-600">
                      Unit: {p.unit} • Min: {p.minStock}
                      {need > 0 ? (
                        <span className="ml-2 text-xs text-red-700 font-semibold">
                          Need: {need} {p.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Qty</div>
                    <div className="text-2xl font-extrabold">{p.qty}</div>
                  </div>
                </div>

                {/* Quick update buttons */}
                <div className="mt-3 grid grid-cols-5 gap-2">
                  <SmallBtn onClick={() => quickChange(p, -1, "Sold")}>-1</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, -5, "Sold")}>-5</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +1, "Restock")}>+1</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +5, "Restock")}>+5</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +10, "Restock")}>+10</SmallBtn>
                </div>

                <button
                  onClick={() => openUpdate(p)}
                  className="mt-3 w-full rounded-2xl border py-3 font-semibold active:scale-[0.99]"
                >
                  🔁 Advanced Update
                </button>
              </div>
            );
          })}

          {!loading && (tab === "ALL" ? filtered : items).length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow ring-1 ring-black/5">
              No products found.
            </div>
          ) : null}
        </div>

        {/* Advanced Update Panel */}
        {selected ? (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold">{selected.name}</div>
                <div className="text-sm text-gray-600">
                  Current: <b>{selected.qty}</b> {selected.unit} • Min: {selected.minStock}
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
              Tip: Stock Aaya = +ve, Bik Gaya = -ve
            </p>
          </div>
        ) : null}
      </Container>

      <BottomNav />
    </>
  );
}