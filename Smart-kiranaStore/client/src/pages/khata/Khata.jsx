import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet, apiPost } from "../../services/api";

export default function Khata() {
  const [params] = useSearchParams();

  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [amount, setAmount] = useState(""); // for PAYMENT
  const [note, setNote] = useState("");

  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ Items for Udhaar
  const [items, setItems] = useState([]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === selectedId),
    [customers, selectedId]
  );

  // ✅ total from items
  const itemsTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + Number(it.total || 0), 0);
  }, [items]);

  const loadCustomers = async () => {
    setErr("");
    try {
      const data = await apiGet("/customers?search=");
      setCustomers(data);

      // ✅ auto select from query param if present
      const qp = params.get("customerId");
      if (qp && data.some((c) => c._id === qp)) {
        setSelectedId(qp);
      } else if (!selectedId && data.length) {
        setSelectedId(data[0]._id);
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const loadLedger = async (customerId) => {
    if (!customerId) return;
    setErr("");
    setLoading(true);
    try {
      const data = await apiGet(`/transactions/${customerId}`);
      setLedger(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedId) loadLedger(selectedId);
    // eslint-disable-next-line
  }, [selectedId]);

  // ✅ item handlers
  const addItem = () => {
    setItems((prev) => [...prev, { name: "", qty: 1, price: 0, total: 0 }]);
  };

  const updateItem = (index, field, value) => {
    setItems((prev) => {
      const copy = [...prev];
      const it = { ...copy[index] };

      if (field === "name") it.name = value;
      if (field === "qty") it.qty = Number(value || 0);
      if (field === "price") it.price = Number(value || 0);

      const qty = Number(it.qty || 0);
      const price = Number(it.price || 0);
      it.total =
        (Number.isFinite(qty) ? qty : 0) * (Number.isFinite(price) ? price : 0);

      copy[index] = it;
      return copy;
    });
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setAmount("");
    setNote("");
    setItems([]);
  };

  const submitPayment = async () => {
    setErr("");
    const amt = Number(amount);

    console.log("[Khata] PAYMENT", { selectedId, amt });

    if (!selectedId) return setErr("Customer select karo");
    if (!Number.isFinite(amt) || amt <= 0)
      return setErr("Amount > 0 hona chahiye");

    try {
      await apiPost("/transactions", {
        customerId: selectedId,
        type: "PAYMENT",
        amount: amt,
        note: note.trim(),
        items: [],
      });

      await loadCustomers();
      await loadLedger(selectedId);
      clearForm();
    } catch (e) {
      setErr(e.message);
    }
  };

  const submitUdhaar = async () => {
    setErr("");

    console.log("[Khata] UDAAR", { selectedId, items, itemsTotal });

    if (!selectedId) return setErr("Customer select karo");
    if (items.length === 0) return setErr("Kam se kam 1 item add karo");

    const clean = items
      .map((it) => ({
        name: String(it.name || "").trim(),
        qty: Number(it.qty),
        price: Number(it.price),
        total: Number(it.total),
      }))
      .filter((it) => it.name && Number.isFinite(it.qty) && it.qty > 0);

    if (clean.length === 0) return setErr("Items valid nahi hain");

    const total = clean.reduce((s, it) => s + (Number(it.total) || 0), 0);
    if (!Number.isFinite(total) || total <= 0) return setErr("Total amount valid nahi");

    try {
      await apiPost("/transactions", {
        customerId: selectedId,
        type: "UDAAR",
        amount: total,
        note: note.trim(),
        items: clean,
      });

      await loadCustomers();
      await loadLedger(selectedId);
      clearForm();
    } catch (e) {
      setErr(e.message);
    }
  };

  const openWhatsapp = () => {
    if (!selectedCustomer) return;
    const baki = Number(selectedCustomer.balance || 0);
    const msg = `Namaste! Aapka Kirana Store me ₹${baki} baki hai. Kripya jama kar dein.`;
    const phone = String(selectedCustomer.phone || "").replace(/\D/g, "").slice(-10);
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Container title="Khata (Udhaar)">
        <div className="rounded-2xl bg-white p-4 shadow">
          <label className="text-sm font-semibold text-gray-700">Customer</label>

          <select
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {customers.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>

          <div className="mt-4 rounded-2xl border p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Total Baki</div>
                <div className="text-2xl font-extrabold">
                  ₹{selectedCustomer?.balance ?? 0}
                </div>
              </div>

              <button
                onClick={openWhatsapp}
                className="rounded-2xl border px-4 py-2 text-sm font-semibold active:scale-[0.99]"
                disabled={!selectedCustomer}
              >
                📲 WhatsApp
              </button>
            </div>

            {/* ✅ UDAAR ITEMS */}
            <div className="mt-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">Items (Udhaar)</div>
                <button
                  onClick={addItem}
                  className="rounded-xl border px-3 py-2 text-sm font-semibold active:scale-[0.99]"
                >
                  + Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="mt-3 text-sm text-gray-600">
                  No items. Udhaar ke liye item add karo.
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 rounded-2xl border p-2"
                    >
                      <input
                        className="col-span-5 rounded-xl border px-3 py-2 text-sm outline-none"
                        placeholder="Item (Maggi)"
                        value={it.name}
                        onChange={(e) => updateItem(idx, "name", e.target.value)}
                      />

                      <input
                        className="col-span-2 rounded-xl border px-3 py-2 text-sm outline-none"
                        placeholder="Qty"
                        inputMode="numeric"
                        value={String(it.qty ?? "")}
                        onChange={(e) =>
                          updateItem(idx, "qty", e.target.value.replace(/\D/g, ""))
                        }
                      />

                      <input
                        className="col-span-3 rounded-xl border px-3 py-2 text-sm outline-none"
                        placeholder="Price"
                        inputMode="numeric"
                        value={String(it.price ?? "")}
                        onChange={(e) =>
                          updateItem(idx, "price", e.target.value.replace(/\D/g, ""))
                        }
                      />

                      <button
                        onClick={() => removeItem(idx)}
                        className="col-span-2 rounded-xl border px-2 py-2 text-sm font-semibold text-red-600 active:scale-[0.99]"
                        title="Remove"
                      >
                        ✖
                      </button>

                      <div className="col-span-12 text-right text-xs text-gray-500">
                        Total: ₹{it.total || 0}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 rounded-2xl bg-gray-50 p-3 text-right">
                <div className="text-xs text-gray-500">Udhaar Total</div>
                <div className="text-2xl font-extrabold">₹{itemsTotal}</div>
              </div>

              <button
                onClick={submitUdhaar}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                ➕ Udhaar Save (Items)
              </button>
            </div>

            {/* ✅ PAYMENT */}
            <div className="mt-4 rounded-2xl border p-4">
              <div className="text-sm font-bold">Payment (Paisa Mila)</div>
              <input
                className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Payment Amount (₹)"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />
              <button
                onClick={submitPayment}
                className="mt-3 w-full rounded-2xl border py-3 font-semibold active:scale-[0.99]"
              >
                ✅ Paisa Mila Save
              </button>
            </div>

            <input
              className="mt-4 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
            />

            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
          </div>
        </div>

        {/* Ledger */}
        <div className="mt-4 space-y-3">
          <div className="text-sm font-bold text-gray-800">Recent Entries</div>
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {ledger.map((t) => (
            <div key={t._id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">
                  {t.type === "UDAAR" ? "➕ Udhaar" : "✅ Payment"}
                </div>
                <div className="text-lg font-extrabold">₹{t.amount}</div>
              </div>

              <div className="mt-1 text-xs text-gray-500">
                {new Date(t.createdAt).toLocaleString()}
              </div>

              {t.items?.length ? (
                <div className="mt-3 rounded-2xl border p-3">
                  <div className="text-xs font-bold text-gray-700">Items</div>
                  <div className="mt-2 space-y-1">
                    {t.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="text-gray-800">
                          {it.name} × {it.qty}
                        </div>
                        <div className="font-semibold">₹{it.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {t.note ? <div className="mt-2 text-sm text-gray-700">{t.note}</div> : null}
            </div>
          ))}

          {!loading && selectedId && ledger.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow">
              No entries yet.
            </div>
          ) : null}
        </div>
      </Container>

      <BottomNav />
    </>
  );
}