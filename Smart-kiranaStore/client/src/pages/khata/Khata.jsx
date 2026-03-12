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
      className={`rounded-xl px-3 py-2 text-sm font-semibold active:scale-[0.99] transition ${
        dark ? "bg-black text-white" : "border bg-white text-gray-900"
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
      setErr(e.message);
    }
  };

  const loadLedger = async (customerId) => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/transactions/${customerId}?shopId=${shop._id}`);
      setLedger(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message);
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
    const amt = Number(amount);
    if (!selectedId) return setErr("Customer select karo");
    if (!Number.isFinite(amt) || amt <= 0) return setErr("Amount > 0 hona chahiye");

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
      setErr(e.message);
    }
  };

  const submitUdhaar = async () => {
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
      setErr(e.message);
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
      <Container title={`Khata • ${shop?.shopName || ""}`}>
        <div className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
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
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-gray-500">
                  {isBaki ? "Total Baki" : isAdvance ? "Advance Jama" : "Account"}
                </div>
                <div
                  className={`text-4xl font-extrabold ${
                    isBaki
                      ? "text-red-700"
                      : isAdvance
                      ? "text-green-700"
                      : "text-gray-900"
                  }`}
                >
                  {balance === 0 ? "Clear" : money(balance)}
                </div>

                {lastEntry ? (
                  <div className="mt-2 text-xs text-gray-500">
                    Last: <b>{lastEntry.type} ₹{lastEntry.amount}</b>
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-gray-500">No previous entry</div>
                )}
              </div>

              {selectedId ? (
                <Link
                  to={`/customers/${selectedId}`}
                  className="rounded-2xl border px-4 py-3 text-center text-sm font-semibold active:scale-[0.99]"
                >
                  🧾 History
                </Link>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="text-sm font-bold">⚡ Quick Udhaar</div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <QuickBtn onClick={() => addQuickUdhaarItem(10)} dark>+₹10</QuickBtn>
                <QuickBtn onClick={() => addQuickUdhaarItem(20)} dark>+₹20</QuickBtn>
                <QuickBtn onClick={() => addQuickUdhaarItem(50)} dark>+₹50</QuickBtn>
                <QuickBtn onClick={() => addQuickUdhaarItem(100)}>+₹100</QuickBtn>
                <QuickBtn onClick={() => addQuickUdhaarItem(200)}>+₹200</QuickBtn>
                <QuickBtn onClick={() => addQuickUdhaarItem(500)}>+₹500</QuickBtn>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">Items (Udhaar)</div>
                <button
                  onClick={addItem}
                  className="rounded-xl border px-3 py-2 text-sm font-semibold"
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
                    <div key={idx} className="grid grid-cols-12 gap-2 rounded-2xl border p-2">
                      <input
                        className="col-span-5 rounded-xl border px-3 py-2 text-sm outline-none"
                        placeholder="Item"
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
                        className="col-span-2 rounded-xl border px-2 py-2 text-sm font-semibold text-red-600"
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
                <div className="text-3xl font-extrabold">₹{itemsTotal}</div>
              </div>

              <button
                onClick={submitUdhaar}
                className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white"
              >
                ➕ Udhaar Save (Items)
              </button>
            </div>

            <div className="mt-4 rounded-2xl border p-4">
              <div className="text-sm font-bold">Payment (Paisa Mila)</div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                <QuickBtn onClick={() => applyQuickPayment(50)}>50</QuickBtn>
                <QuickBtn onClick={() => applyQuickPayment(100)}>100</QuickBtn>
                <QuickBtn onClick={() => applyQuickPayment(200)}>200</QuickBtn>
                <QuickBtn onClick={() => applyQuickPayment(500)}>500</QuickBtn>
              </div>

              <input
                className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                placeholder="Payment Amount (₹)"
                inputMode="numeric"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <button
                onClick={submitPayment}
                className="mt-3 w-full rounded-2xl border py-3 font-semibold"
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

        <div className="mt-4 space-y-3">
          <div className="text-sm font-bold text-gray-800">Recent Entries</div>
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {ledger.slice(0, 3).map((t) => (
            <div key={t._id} className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
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
                    {t.items.slice(0, 3).map((it, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div className="text-gray-800">{it.name} × {it.qty}</div>
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