import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet, apiPost } from "../../services/api";
import { AuthService } from "../../services/auth";

function QuickBtn({ onClick, children, dark = false }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-3 py-2 text-sm font-semibold transition active:scale-[0.98] ${
        dark
          ? "bg-black text-white shadow-sm"
          : "bg-white text-gray-800 ring-1 ring-black/5 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function money(v) {
  return `₹${Math.abs(Number(v || 0))}`;
}

export default function Khata() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const shop = AuthService.getSelectedShop();

  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [items, setItems] = useState([]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === selectedId),
    [customers, selectedId]
  );

  const itemsTotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.total || 0), 0),
    [items]
  );

  const lastEntry = useMemo(() => ledger?.[0] || null, [ledger]);

  const loadCustomers = async () => {
    try {
      const data = await apiGet(`/customers?shopId=${shop._id}&search=`);
      setCustomers(Array.isArray(data) ? data : []);

      const qp = params.get("customerId");

      if (qp && data.some((c) => c._id === qp)) {
        setSelectedId(qp);
      } else if (data.length) {
        setSelectedId(data[0]._id);
      }
    } catch (e) {
      setErr(e.message || "Failed to load customers");
    }
  };

  const loadLedger = async (customerId) => {
    if (!customerId) return;

    setLoading(true);
    setErr("");

    try {
      const data = await apiGet(`/transactions/${customerId}?shopId=${shop._id}`);
      setLedger(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shop?._id) {
      navigate("/shops", { replace: true });
      return;
    }

    loadCustomers();
  }, [shop?._id]);

  useEffect(() => {
    if (selectedId) loadLedger(selectedId);
  }, [selectedId]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { name: "", qty: 1, price: 0, total: 0 },
    ]);
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
      it.total = qty * price;

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

    if (!selectedId) return setErr("Customer select karo");
    if (!Number.isFinite(amt) || amt <= 0) {
      return setErr("Amount > 0 hona chahiye");
    }

    try {
      await apiPost("/transactions", {
        shopId: shop._id,
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
      setErr(e.message || "Payment save failed");
    }
  };

  const submitUdhaar = async () => {
    setErr("");

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

    const total = clean.reduce((s, it) => s + Number(it.total || 0), 0);
    if (total <= 0) return setErr("Total amount valid nahi");

    try {
      await apiPost("/transactions", {
        shopId: shop._id,
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
      setErr(e.message || "Udhaar save failed");
    }
  };

  const applyQuickPayment = (val) => {
    const current = Number(amount || 0);
    setAmount(String(current + val));
  };

  const addQuickUdhaarItem = (amt) => {
    setItems((prev) => [
      ...prev,
      { name: `Quick Item ${amt}`, qty: 1, price: amt, total: amt },
    ]);
  };

  const balance = Number(selectedCustomer?.balance || 0);
  const isBaki = balance > 0;
  const isAdvance = balance < 0;

  return (
    <>
      <Container title="Khata">
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/70">
            {shop?.shopName || "Smart Kirana"}
          </div>

          <div className="mt-3">
            <label className="text-xs uppercase tracking-wide text-white/60">
              Customer
            </label>

            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white outline-none"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {customers.map((c) => (
                <option key={c._id} value={c._id} className="text-black">
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 rounded-3xl bg-white/10 p-4">
            <div className="text-xs uppercase tracking-wide text-white/60">
              {isBaki ? "Total Baki" : isAdvance ? "Advance Jama" : "Account Status"}
            </div>

            <div
              className={`mt-2 text-4xl font-extrabold ${
                isBaki
                  ? "text-red-300"
                  : isAdvance
                  ? "text-green-300"
                  : "text-white"
              }`}
            >
              {balance === 0 ? "Clear" : money(balance)}
            </div>

            {lastEntry ? (
              <div className="mt-2 text-sm text-white/70">
                Last Entry: {lastEntry.type} ₹{lastEntry.amount}
              </div>
            ) : (
              <div className="mt-2 text-sm text-white/70">No previous entry</div>
            )}
          </div>

          {selectedId ? (
            <Link
              to={`/customers/${selectedId}`}
              className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-gray-100"
            >
              🧾 View Full History
            </Link>
          ) : null}
        </div>

        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">⚡ Quick Udhaar</div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <QuickBtn onClick={() => addQuickUdhaarItem(10)} dark>
              +₹10
            </QuickBtn>
            <QuickBtn onClick={() => addQuickUdhaarItem(20)} dark>
              +₹20
            </QuickBtn>
            <QuickBtn onClick={() => addQuickUdhaarItem(50)} dark>
              +₹50
            </QuickBtn>
            <QuickBtn onClick={() => addQuickUdhaarItem(100)}>+₹100</QuickBtn>
            <QuickBtn onClick={() => addQuickUdhaarItem(200)}>+₹200</QuickBtn>
            <QuickBtn onClick={() => addQuickUdhaarItem(500)}>+₹500</QuickBtn>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-base font-bold text-gray-900">Items for Udhaar</div>

            <button
              onClick={addItem}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="mt-4 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500 ring-1 ring-black/5">
              No items added yet.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-gray-50 p-3 ring-1 ring-black/5"
                >
                  <input
                    className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                    placeholder="Item name"
                    value={it.name}
                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                  />

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <input
                      className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      placeholder="Qty"
                      inputMode="numeric"
                      value={String(it.qty ?? "")}
                      onChange={(e) =>
                        updateItem(idx, "qty", e.target.value.replace(/\D/g, ""))
                      }
                    />

                    <input
                      className="rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                      placeholder="Price"
                      inputMode="numeric"
                      value={String(it.price ?? "")}
                      onChange={(e) =>
                        updateItem(idx, "price", e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-600">
                      Total: ₹{it.total || 0}
                    </div>

                    <button
                      onClick={() => removeItem(idx)}
                      className="rounded-2xl px-3 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 rounded-3xl bg-black p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Udhaar Total
            </div>
            <div className="mt-1 text-4xl font-extrabold">₹{itemsTotal}</div>
          </div>

          <button
            onClick={submitUdhaar}
            className="mt-4 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-900"
          >
            ➕ Save Udhaar
          </button>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">✅ Payment Entry</div>

          <div className="mt-4 flex flex-wrap gap-2">
            <QuickBtn onClick={() => applyQuickPayment(50)}>+50</QuickBtn>
            <QuickBtn onClick={() => applyQuickPayment(100)}>+100</QuickBtn>
            <QuickBtn onClick={() => applyQuickPayment(200)}>+200</QuickBtn>
            <QuickBtn onClick={() => applyQuickPayment(500)}>+500</QuickBtn>
          </div>

          <input
            className="mt-4 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            placeholder="Payment Amount (₹)"
            inputMode="numeric"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
          />

          <input
            className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={80}
          />

          <button
            onClick={submitPayment}
            className="mt-4 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-900"
          >
            Save Payment
          </button>

          {err ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="mb-3 text-base font-bold text-gray-900">
            Recent Entries
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && selectedId && ledger.length === 0 ? (
            <div className="rounded-3xl bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No entries yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {ledger.slice(0, 5).map((t) => (
              <div
                key={t._id}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {t.type === "UDAAR" ? "➕ Udhaar" : "✅ Payment"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      ₹{t.amount}
                    </div>
                  </div>
                </div>

                {t.items?.length ? (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </div>

                    <div className="mt-2 space-y-2">
                      {t.items.slice(0, 3).map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <div className="text-gray-800">
                            {it.name} × {it.qty}
                          </div>
                          <div className="font-semibold text-gray-900">
                            ₹{it.total}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {t.note ? (
                  <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-black/5">
                    {t.note}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}