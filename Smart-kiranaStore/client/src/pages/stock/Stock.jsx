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
  const base = "rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition";
  const cls =
    variant === "dark"
      ? `${base} bg-black text-white`
      : variant === "danger"
      ? `${base} bg-red-600 text-white`
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
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ totalProducts: 0, lowStockCount: 0, totalQty: 0 });

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

  // panel (selected product)
  const [selected, setSelected] = useState(null);
  const [change, setChange] = useState("");
  const [reason, setReason] = useState("");

  // edit mode
  const [editMode, setEditMode] = useState(false);
  const [eName, setEName] = useState("");
  const [eUnit, setEUnit] = useState("pcs");
  const [eMinStock, setEMinStock] = useState("0");
  const [eCategory, setECategory] = useState("");
  const [eBarcode, setEBarcode] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => String(p.name || "").toLowerCase().includes(q));
  }, [items, search]);

  const reorderNeed = (p) => {
    const q = Number(p.qty || 0);
    const ms = Number(p.minStock || 0);
    const buffer = 2;
    const need = ms - q + buffer;
    return need > 0 ? need : 0;
  };

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [listData, sum] = await Promise.all([
        tab === "LOW" ? StockAPI.low() : StockAPI.list(search),
        StockAPI.summary().catch(() => null),
      ]);

      setItems(Array.isArray(listData) ? listData : []);
      if (sum) setSummary(sum);
      else {
        // fallback summary from list
        const all = Array.isArray(listData) ? listData : [];
        const low = all.filter((p) => Number(p.qty || 0) <= Number(p.minStock || 0)).length;
        const totalQty = all.reduce((s, p) => s + Number(p.qty || 0), 0);
        setSummary({ totalProducts: all.length, lowStockCount: low, totalQty });
      }
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
    if (!Number.isFinite(ms) || ms < 0) return setErr("MinStock >= 0 hona chahiye");

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

  const loadLogs = async (productId) => {
    try {
      const data = await StockAPI.logs(productId);
      setLogs(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load logs");
      setLogs([]);
    }
  };

  const openPanel = async (product) => {
    setSelected(product);
    setChange("");
    setReason("");
    setEditMode(false);

    // preload edit fields
    setEName(product.name || "");
    setEUnit(product.unit || "pcs");
    setEMinStock(String(product.minStock ?? 0));
    setECategory(product.category || "");
    setEBarcode(product.barcode || "");

    await loadLogs(product._id);
  };

  const quickChange = async (p, ch, r) => {
    setErr("");
    try {
      await StockAPI.update({ productId: p._id, change: ch, reason: r });
      await load();
      if (selected?._id === p._id) {
        await loadLogs(p._id);
        const updated = await StockAPI.list(""); // refresh selected snapshot
        const found = updated.find((x) => x._id === p._id);
        if (found) setSelected(found);
      }
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
      await load();
      await loadLogs(selected._id);
      setChange("");
      setReason("");
    } catch (e) {
      setErr(e.message || "Failed to update stock");
    }
  };

  const saveEdit = async () => {
    setErr("");
    if (!selected?._id) return;

    const ms = Number(eMinStock);
    if (!eName.trim()) return setErr("Name required");
    if (!Number.isFinite(ms) || ms < 0) return setErr("MinStock >= 0 hona chahiye");

    try {
      const updated = await StockAPI.edit(selected._id, {
        name: eName.trim(),
        unit: eUnit.trim() || "pcs",
        minStock: ms,
        category: eCategory.trim(),
        barcode: eBarcode.trim(),
      });
      setSelected(updated);
      setEditMode(false);
      await load();
    } catch (e) {
      setErr(e.message || "Edit failed");
    }
  };

  const deleteProduct = async () => {
    setErr("");
    if (!selected?._id) return;

    const ok = window.confirm(`Delete "${selected.name}" ?`);
    if (!ok) return;

    try {
      await StockAPI.remove(selected._id);
      setSelected(null);
      setLogs([]);
      await load();
    } catch (e) {
      setErr(e.message || "Delete failed");
    }
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
        {/* ✅ Summary card */}
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-sm font-bold">Today Stock Summary</div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border bg-white p-3">
              <div className="text-xs text-gray-500">Products</div>
              <div className="text-xl font-extrabold">{summary.totalProducts}</div>
            </div>
            <div className="rounded-2xl border bg-white p-3">
              <div className="text-xs text-gray-500">Low</div>
              <div className="text-xl font-extrabold">{summary.lowStockCount}</div>
            </div>
            <div className="rounded-2xl border bg-white p-3">
              <div className="text-xs text-gray-500">Total Qty</div>
              <div className="text-xl font-extrabold">{summary.totalQty}</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Low stock = <b>qty ≤ minStock</b>
          </div>
        </div>

        {/* Search (ALL tab) */}
        {tab === "ALL" ? (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <input
              className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Search product (Maggi / Sugar)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="mt-2 text-xs text-gray-500">Type to search (auto)</div>
          </div>
        ) : null}

        {/* Add Product (collapsible) */}
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
                  onChange={(e) => setMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>

              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Starting Qty"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />

              {/* optional simple fields */}
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
              Clean screen ke liye form hide hai. <b>Open</b> dabao.
            </div>
          )}

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        {/* List */}
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {filtered.map((p) => {
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
                      {p.category ? <span className="ml-2 text-xs">• {p.category}</span> : null}
                      {p.barcode ? <span className="ml-2 text-xs">• #{p.barcode}</span> : null}
                      {isLow && need > 0 ? (
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

                {/* Quick buttons */}
                <div className="mt-3 grid grid-cols-5 gap-2">
                  <SmallBtn onClick={() => quickChange(p, -1, "Sold")}>-1</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, -5, "Sold")}>-5</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +1, "Restock")}>+1</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +5, "Restock")}>+5</SmallBtn>
                  <SmallBtn onClick={() => quickChange(p, +10, "Restock")}>+10</SmallBtn>
                </div>

                <SmallBtn onClick={() => openPanel(p)} className="mt-3 w-full">
                  ⚙️ Manage (Edit / Logs / Advanced)
                </SmallBtn>
              </div>
            );
          })}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow ring-1 ring-black/5">
              No products found.
            </div>
          ) : null}
        </div>

        {/* Manage Panel */}
        {selected ? (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-base font-bold">{selected.name}</div>
                <div className="text-sm text-gray-600">
                  Current: <b>{selected.qty}</b> {selected.unit} • Min: {selected.minStock}
                </div>
              </div>

              <SmallBtn onClick={() => { setSelected(null); setLogs([]); setEditMode(false); }}>
                ✖ Close
              </SmallBtn>
            </div>

            {/* Edit / Delete */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <SmallBtn onClick={() => setEditMode((s) => !s)} variant="dark">
                ✏️ {editMode ? "Close Edit" : "Edit Product"}
              </SmallBtn>
              <SmallBtn onClick={deleteProduct} variant="danger">
                🗑️ Delete
              </SmallBtn>
            </div>

            {editMode ? (
              <div className="mt-3 rounded-2xl border p-3 space-y-3">
                <input
                  className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Name"
                  value={eName}
                  onChange={(e) => setEName(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                    value={eUnit}
                    onChange={(e) => setEUnit(e.target.value)}
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
                    value={eMinStock}
                    onChange={(e) => setEMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                    placeholder="Category"
                    value={eCategory}
                    onChange={(e) => setECategory(e.target.value)}
                  />
                  <input
                    className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                    placeholder="Barcode/SKU"
                    value={eBarcode}
                    onChange={(e) => setEBarcode(e.target.value)}
                  />
                </div>

                <SmallBtn variant="dark" onClick={saveEdit}>
                  ✅ Save Changes
                </SmallBtn>
              </div>
            ) : null}

            {/* Advanced Update */}
            <div className="mt-4 rounded-2xl border p-3">
              <div className="text-sm font-bold">🔁 Advanced Update</div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <SmallBtn variant="dark" onClick={setIncoming}>
                  ➕ Stock Aaya
                </SmallBtn>
                <SmallBtn onClick={setOutgoing}>➖ Bik Gaya</SmallBtn>
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

              <SmallBtn variant="dark" onClick={saveUpdate} className="mt-3 w-full">
                ✅ Save Update
              </SmallBtn>

              <p className="mt-2 text-xs text-gray-500">
                Tip: Stock Aaya = +ve, Bik Gaya = -ve
              </p>
            </div>

            {/* Logs */}
            <div className="mt-4 rounded-2xl border p-3">
              <div className="text-sm font-bold">📜 Recent Activity (Logs)</div>
              {logs.length === 0 ? (
                <div className="mt-2 text-xs text-gray-500">No activity yet</div>
              ) : (
                <div className="mt-2 space-y-2">
                  {logs.map((l) => (
                    <div key={l._id} className="flex items-start justify-between text-sm">
                      <div className="text-gray-800">
                        {l.change > 0 ? "➕" : "➖"} {Math.abs(l.change)}{" "}
                        {l.reason ? <span className="text-gray-500">({l.reason})</span> : null}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(l.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Container>

      <BottomNav />
    </>
  );
}