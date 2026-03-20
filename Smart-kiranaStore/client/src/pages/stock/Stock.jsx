import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Boxes,
  Search,
  Plus,
  PackagePlus,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CircleCheckBig,
} from "lucide-react";

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

function QuickActionBtn({ onClick, children, dark = false }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition ${
        dark
          ? "bg-black text-white hover:bg-gray-900"
          : "border border-black/10 bg-white text-gray-900 hover:bg-gray-50"
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

function unitOptions() {
  return ["pcs", "kg", "ltr", "pack"];
}

function StatusBadge({ isLow, need, unit }) {
  if (isLow) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
        <AlertTriangle className="h-3.5 w-3.5" />
        Low Stock • Need {need} {unit}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
      <CircleCheckBig className="h-3.5 w-3.5" />
      Stock OK
    </div>
  );
}

function ProductCard({ product, onUpdate }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-extrabold tracking-tight text-gray-900">
            {product.name}
          </div>

          <div className="mt-2 text-sm text-gray-500">
            Unit: {product.unit} • Min Stock: {product.minStock}
          </div>

          <div className="mt-3">
            <StatusBadge
              isLow={product.isLow}
              need={product.need}
              unit={product.unit}
            />
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Quantity</div>
          <div
            className={`mt-1 text-3xl font-extrabold ${
              product.isLow ? "text-red-600" : "text-gray-900"
            }`}
          >
            {product.qty}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickActionBtn onClick={() => onUpdate(product, -1, "Sold")}>
          <span className="inline-flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            -1
          </span>
        </QuickActionBtn>

        <QuickActionBtn onClick={() => onUpdate(product, -5, "Sold")}>
          <span className="inline-flex items-center gap-2">
            <ArrowDown className="h-4 w-4" />
            -5
          </span>
        </QuickActionBtn>

        <QuickActionBtn dark onClick={() => onUpdate(product, 1, "Restock")}>
          <span className="inline-flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            +1
          </span>
        </QuickActionBtn>

        <QuickActionBtn dark onClick={() => onUpdate(product, 5, "Restock")}>
          <span className="inline-flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            +5
          </span>
        </QuickActionBtn>
      </div>
    </div>
  );
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
    if (!Number.isFinite(q) || q < 0) {
      return setErr("Qty 0 ya usse zyada hona chahiye");
    }
    if (!Number.isFinite(ms) || ms < 0) {
      return setErr("Min stock 0 ya usse zyada hona chahiye");
    }

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

  const lowCount = computed.filter((p) => p.isLow).length;

  return (
    <div className="lg:ml-64 min-h-screen bg-[#f4f7fb]">
      <Container
        title="Stock"
        subtitle={shop?.shopName || "Smart Kirana"}
        right={
          <div className="flex gap-2">
            <TabBtn active={tab === "LOW"} onClick={() => setTab("LOW")}>
              Low Stock
            </TabBtn>
            <TabBtn active={tab === "ALL"} onClick={() => setTab("ALL")}>
              All Products
            </TabBtn>
          </div>
        }
      >
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 md:p-8 text-white shadow-lg">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <div className="text-sm text-white/70">Inventory Management</div>
              <div className="mt-3 text-4xl font-extrabold tracking-tight">
                Track stock smarter
              </div>
              <div className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Products add karo, low stock monitor karo aur quick quantity
                updates ke saath inventory manage karo.
              </div>

              {tab === "ALL" ? (
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5">
                  <Search className="h-5 w-5 text-white/70" />
                  <input
                    className="w-full bg-transparent text-base text-white placeholder:text-white/55 outline-none"
                    placeholder="Search product"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                  Low stock ka matlab: <b>qty ≤ minStock</b>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Total Products
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Boxes className="h-8 w-8 text-white/80" />
                  <div className="text-5xl font-extrabold">{computed.length}</div>
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-xs uppercase tracking-wide text-white/60">
                  Low Stock Count
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-300" />
                  <div className="text-5xl font-extrabold">{lowCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product */}
        <div className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-lg font-bold text-gray-900">
                Add Product
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Naya product inventory me add karo.
              </div>
            </div>

            <button
              onClick={() => setShowAdd((s) => !s)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
            >
              <PackagePlus className="h-4 w-4" />
              {showAdd ? "Close" : "Open Add Product"}
            </button>
          </div>

          {showAdd ? (
            <div className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.7fr_0.7fr_0.8fr]">
              <input
                className="w-full rounded-2xl border px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <select
                className="w-full rounded-2xl border px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-black"
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
                className="w-full rounded-2xl border px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Min stock"
                inputMode="numeric"
                value={minStock}
                onChange={(e) =>
                  setMinStock(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <input
                className="w-full rounded-2xl border px-4 py-3.5 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Starting qty"
                inputMode="numeric"
                value={qty}
                onChange={(e) =>
                  setQty(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <div className="xl:col-span-4">
                <button
                  onClick={addProduct}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          ) : null}

          {err ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        {/* Product List */}
        <div className="mt-8">
          <div className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Product List
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && computed.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-gray-500 shadow-sm ring-1 ring-black/5">
              No products found.
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
            {computed.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onUpdate={quickUpdate}
              />
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </div>
  );
}