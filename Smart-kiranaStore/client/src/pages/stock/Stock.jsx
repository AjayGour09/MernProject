import { useEffect, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";

import { StockAPI } from "../../services/stock.api";

export default function Stock() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [qty, setQty] = useState("");
  const [minStock, setMinStock] = useState("");

  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async (q = search) => {
    try {
      setLoading(true);
      const data = await StockAPI.list(q);
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
  }, []);

  const addProduct = async () => {
    if (!name.trim()) {
      return setErr("Product name required");
    }

    try {
      await StockAPI.add({
        name: name.trim(),
        unit,
        qty: Number(qty || 0),
        minStock: Number(minStock || 0),
      });

      setName("");
      setQty("");
      setMinStock("");

      await load("");
    } catch (e) {
      setErr(e.message);
    }
  };

  const updateQty = async (productId, change) => {
    try {
      await StockAPI.update({
        productId,
        change,
        reason: "manual update",
      });

      await load(search);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <>
      <Container title="Stock">
        {/* SEARCH */}
        <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-sm font-semibold text-gray-700">
            Search Product
          </div>

          <input
            className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            placeholder="Search product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => load(search)}
            className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
          >
            🔍 Search
          </button>
        </div>

        {/* ADD PRODUCT */}
        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-sm font-semibold text-gray-700">
            Add Product
          </div>

          <input
            className="mt-3 w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-3 gap-3 mt-3">
            <input
              className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Qty"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />

            <input
              className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Min"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />

            <input
              className="rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              placeholder="Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <button
            onClick={addProduct}
            className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
          >
            ✅ Save Product
          </button>

          {err ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        {/* PRODUCT LIST */}
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : null}

          {items.map((p) => {
            const low = Number(p.qty) <= Number(p.minStock);

            return (
              <div
                key={p._id}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {p.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {p.unit}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-2xl font-extrabold ${
                        low ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {p.qty}
                    </div>

                    {low ? (
                      <div className="text-xs text-red-500">
                        Low Stock
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => updateQty(p._id, 1)}
                    className="rounded-2xl border py-3 font-semibold"
                  >
                    ➕ Add
                  </button>

                  <button
                    onClick={() => updateQty(p._id, -1)}
                    className="rounded-2xl border py-3 font-semibold"
                  >
                    ➖ Reduce
                  </button>
                </div>
              </div>
            );
          })}

          {!loading && items.length === 0 ? (
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5 text-gray-500">
              No products yet.
            </div>
          ) : null}
        </div>
      </Container>

      <BottomNav />
    </>
  );
}