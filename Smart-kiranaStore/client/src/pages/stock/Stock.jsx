// client/src/pages/stock/Stock.jsx
import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { StockAPI } from "../../services/stock.api";

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition ${
        active ? "bg-black text-white" : "border bg-white text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function IconBtn({ onClick, children, variant = "light", disabled }) {
  const base =
    "rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition";
  const cls =
    variant === "dark"
      ? `${base} bg-black text-white`
      : variant === "danger"
      ? `${base} bg-red-600 text-white`
      : variant === "success"
      ? `${base} bg-green-600 text-white`
      : `${base} border bg-white text-gray-900`;

  return (
    <button onClick={onClick} className={cls} disabled={disabled}>
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

function todayStr() {
  try {
    return new Date().toLocaleDateString();
  } catch {
    return "";
  }
}

export default function Stock() {
  const [tab, setTab] = useState("LOW"); // LOW | ALL
  const [view, setView] = useState("LIST"); // LIST | GRID
  const [sortBy, setSortBy] = useState("LOW_FIRST"); // LOW_FIRST | QTY_HIGH | AZ
  const [search, setSearch] = useState("");

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // add product form
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState("");
  const [minStock, setMinStock] = useState("");

  // custom update
  const [selected, setSelected] = useState(null);
  const [change, setChange] = useState("");
  const [reason, setReason] = useState("");

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
    load();
    // eslint-disable-next-line
  }, [tab]);

  // auto refresh on ALL search typing
  useEffect(() => {
    if (tab !== "ALL") return;
    const t = setTimeout(() => load(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, tab]);

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

  // ✅ quick update buttons (no popup)
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

  // prompt helpers
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

  // computed products (need + low + sort)
  const computed = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    let arr = [...items];

    if (tab === "ALL" && q) {
      arr = arr.filter((p) =>
        String(p.name || "").toLowerCase().includes(q)
      );
    }

    arr = arr.map((p) => {
      const need = calcNeed(p.qty, p.minStock);
      const isLow = Number(p.qty || 0) <= Number(p.minStock || 0);
      return { ...p, need, isLow };
    });

    if (sortBy === "LOW_FIRST") {
      arr.sort((a, b) => {
        if (a.isLow !== b.isLow) return a.isLow ? -1 : 1;
        return Number(a.qty || 0) - Number(b.qty || 0);
      });
    } else if (sortBy === "QTY_HIGH") {
      arr.sort((a, b) => Number(b.qty || 0) - Number(a.qty || 0));
    } else if (sortBy === "AZ") {
      arr.sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
    }

    return arr;
  }, [items, search, tab, sortBy]);

  // ✅ Reorder list (need > 0 OR low)
  const reorderList = useMemo(() => {
    return computed
      .filter((p) => p.need > 0 || p.isLow)
      .sort((a, b) => (b.need || 0) - (a.need || 0));
  }, [computed]);

  // ✅ build message
  const buildReorderMessage = () => {
    const list = reorderList.slice(0, 50);
    if (!list.length) return "";

    const lines = list.map((p, idx) => {
      const u = p.unit || "pcs";
      const need = p.need > 0 ? p.need : 0;
      const tag = p.isLow ? "⚠️" : "•";
      return `${idx + 1}) ${tag} ${p.name} - Need: ${need} ${u} (Qty:${p.qty}, Min:${p.minStock})`;
    });

    return (
      `🛒 Smart Kirana - Reorder List\n` +
      `Date: ${todayStr()}\n\n` +
      lines.join("\n") +
      `\n\n(Generated by Smart Kirana)`
    );
  };

  // ✅ WhatsApp share
  const sendReorderWhatsApp = () => {
    const msg = buildReorderMessage();
    if (!msg) return alert("✅ Reorder list empty (sab stock theek hai)");
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // ✅ Copy
  const copyReorder = async () => {
    const msg = buildReorderMessage();
    if (!msg) return alert("✅ Reorder list empty (sab stock theek hai)");
    try {
      await navigator.clipboard.writeText(msg);
      alert("Copied ✅");
    } catch {
      alert("Copy failed (browser issue)");
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
        {/* Top controls */}
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-bold">Controls</div>
              <div className="text-xs text-gray-500">
                Reorder items: <b>{reorderList.length}</b>
              </div>
            </div>

            <div className="flex gap-2">
              <IconBtn onClick={load}>↻</IconBtn>
              <IconBtn variant="success" onClick={sendReorderWhatsApp}>
                📲 Reorder
              </IconBtn>
              <IconBtn onClick={copyReorder}>📋</IconBtn>
            </div>
          </div>

          {/* Search (only meaningful for ALL) */}
          {tab === "ALL" ? (
            <div className="mt-3">
              <input
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Search (Maggi / Sugar)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-1 text-xs text-gray-500">
                Type to search (auto)
              </div>
            </div>
          ) : (
            <div className="mt-3 text-sm text-gray-600">
              Low stock = <b>qty ≤ minStock</b>
            </div>
          )}

          {/* View + sort */}
          <div className="mt-3 flex flex-wrap gap-2">
            <Pill active={view === "LIST"} onClick={() => setView("LIST")}>
              ☰ List
            </Pill>
            <Pill active={view === "GRID"} onClick={() => setView("GRID")}>
              ⬛ Grid
            </Pill>

            <div className="ml-auto flex flex-wrap gap-2">
              <Pill
                active={sortBy === "LOW_FIRST"}
                onClick={() => setSortBy("LOW_FIRST")}
              >
                ⚠️ Low first
              </Pill>
              <Pill
                active={sortBy === "QTY_HIGH"}
                onClick={() => setSortBy("QTY_HIGH")}
              >
                ⬆ Qty high
              </Pill>
              <Pill active={sortBy === "AZ"} onClick={() => setSortBy("AZ")}>
                A-Z
              </Pill>
            </div>
          </div>

          {/* Add product */}
          <div className="mt-4 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div className="text-base font-bold">➕ Add Product</div>
              <IconBtn onClick={() => setShowAdd((s) => !s)}>
                {showAdd ? "Hide" : "Open"}
              </IconBtn>
            </div>

            {showAdd ? (
              <>
                <input
                  className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                  placeholder="Name (Maggi)"
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
                  className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
                >
                  ✅ Save Product
                </button>
              </>
            ) : (
              <div className="mt-2 text-sm text-gray-600">
                Clean screen ke liye form hide hai.
              </div>
            )}
          </div>

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        {/* LIST / GRID */}
        <div className="mt-4">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {!loading && computed.length === 0 ? (
            <div className="rounded-2xl bg-white p-5 text-gray-700 shadow ring-1 ring-black/5">
              <div className="text-base font-extrabold">No products found</div>
              <div className="mt-1 text-sm text-gray-600">
                Pehla product add karo. (Name + Qty + MinStock)
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                ➕ Add Product Now
              </button>
            </div>
          ) : null}

          {view === "GRID" ? (
            <div className="grid grid-cols-2 gap-3">
              {computed.map((p) => (
                <button
                  key={p._id}
                  onClick={() => openUpdate(p)}
                  className={`rounded-2xl bg-white p-4 text-left shadow ring-1 ring-black/5 active:scale-[0.99] transition ${
                    p.isLow ? "ring-2 ring-red-500" : ""
                  }`}
                >
                  <div className="text-sm font-bold truncate">{p.name}</div>

                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Qty</div>
                      <div className="text-3xl font-extrabold">{p.qty}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500">Need</div>
                      <div
                        className={`text-lg font-extrabold ${
                          p.need > 0 ? "text-red-700" : ""
                        }`}
                      >
                        {p.need}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Min: {p.minStock} • Unit: {p.unit}
                  </div>

                  {/* quick */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickUpdate(p, -1, "Sold");
                      }}
                      className="rounded-xl border py-2 text-sm font-bold active:scale-[0.99]"
                    >
                      -1
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickUpdate(p, -5, "Sold");
                      }}
                      className="rounded-xl border py-2 text-sm font-bold active:scale-[0.99]"
                    >
                      -5
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickUpdate(p, +1, "Restock");
                      }}
                      className="rounded-xl bg-black py-2 text-sm font-bold text-white active:scale-[0.99]"
                    >
                      +1
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quickUpdate(p, +5, "Restock");
                      }}
                      className="rounded-xl bg-black py-2 text-sm font-bold text-white active:scale-[0.99]"
                    >
                      +5
                    </button>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
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

                  {/* quick update */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => quickUpdate(p, -1, "Sold")}
                      className="rounded-xl border py-3 text-center font-bold active:scale-[0.99]"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => quickUpdate(p, -5, "Sold")}
                      className="rounded-xl border py-3 text-center font-bold active:scale-[0.99]"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => quickUpdate(p, +1, "Restock")}
                      className="rounded-xl bg-black py-3 text-center font-bold text-white active:scale-[0.99]"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => quickUpdate(p, +5, "Restock")}
                      className="rounded-xl bg-black py-3 text-center font-bold text-white active:scale-[0.99]"
                    >
                      +5
                    </button>
                  </div>

                  <button
                    onClick={() => openUpdate(p)}
                    className="mt-3 w-full rounded-2xl border py-3 font-semibold active:scale-[0.99]"
                  >
                    🔁 Advanced Update
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced Update Panel */}
        {selected ? (
          <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
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
              Tip: Stock Aaya = +ve, Bik Gaya = -ve
            </p>
          </div>
        ) : null}
      </Container>

      <BottomNav />
    </>
  );
}