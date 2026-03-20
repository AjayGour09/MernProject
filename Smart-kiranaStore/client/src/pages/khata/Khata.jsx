import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  UserRound,
  Wallet,
  Plus,
  ReceiptText,
  ArrowRight,
  CircleDollarSign,
  NotebookText,
  Trash2,
} from "lucide-react";

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
          ? "bg-black text-white shadow-sm hover:bg-gray-900"
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

function EntryBadge({ type }) {
  const isUdhaar = type === "UDAAR";

  return (
    <div
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        isUdhaar ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {isUdhaar ? "Udhaar" : "Payment"}
    </div>
  );
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
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingUdhaar, setSavingUdhaar] = useState(false);

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
    setErr("");
    const amt = Number(amount);

    if (!selectedId) return setErr("Customer select karo");
    if (!Number.isFinite(amt) || amt <= 0) {
      return setErr("Amount 0 se bada hona chahiye");
    }

    setSavingPayment(true);
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
    } finally {
      setSavingPayment(false);
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

    if (clean.length === 0) return setErr("Valid items add karo");

    const total = clean.reduce((s, it) => s + Number(it.total || 0), 0);
    if (total <= 0) return setErr("Total valid nahi hai");

    setSavingUdhaar(true);
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
    } finally {
      setSavingUdhaar(false);
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
    <div className="lg:ml-64 min-h-screen bg-[#f4f7fb]">
      <Container title="Khata" subtitle={shop?.shopName || "Smart Kirana"}>
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 md:p-8 text-white shadow-lg">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div>
              <div className="text-sm text-white/70">Khata Management</div>
              <div className="mt-3 text-4xl font-extrabold tracking-tight">
                Manage udhaar & payments
              </div>
              <div className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Customer select karo, udhaar items add karo, payment save karo
                aur recent entries ko track karo.
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-white/80">
                  Selected Customer
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3.5">
                  <UserRound className="h-5 w-5 text-white/70" />
                  <select
                    className="w-full bg-transparent text-base text-white outline-none"
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
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Current Balance
              </div>

              <div
                className={`mt-2 text-5xl font-extrabold ${
                  isBaki
                    ? "text-red-300"
                    : isAdvance
                    ? "text-green-300"
                    : "text-white"
                }`}
              >
                {balance === 0 ? "Clear" : money(balance)}
              </div>

              <div className="mt-2 text-sm text-white/70">
                {isBaki
                  ? "Customer par baki amount hai"
                  : isAdvance
                  ? "Customer ke account me advance hai"
                  : "Account clear hai"}
              </div>

              <div className="mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
                {lastEntry
                  ? `Last Entry: ${lastEntry.type} ₹${lastEntry.amount}`
                  : "No previous entry"}
              </div>

              {selectedId ? (
                <Link
                  to={`/customers/${selectedId}`}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-gray-100"
                >
                  <ReceiptText className="h-4 w-4" />
                  View Full History
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        {/* Top sections */}
        <div className="mt-6 grid gap-6 2xl:grid-cols-[1.1fr_0.9fr]">
          {/* Udhaar */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  <span className="inline-flex items-center gap-2">
                    <NotebookText className="h-5 w-5" />
                    Udhaar Entry
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Items add karo aur total udhaar save karo.
                </div>
              </div>

              <button
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                <Plus className="h-4 w-4" />
                Add Item
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
              <QuickBtn onClick={() => addQuickUdhaarItem(10)} dark>+₹10</QuickBtn>
              <QuickBtn onClick={() => addQuickUdhaarItem(20)} dark>+₹20</QuickBtn>
              <QuickBtn onClick={() => addQuickUdhaarItem(50)} dark>+₹50</QuickBtn>
              <QuickBtn onClick={() => addQuickUdhaarItem(100)}>+₹100</QuickBtn>
              <QuickBtn onClick={() => addQuickUdhaarItem(200)}>+₹200</QuickBtn>
              <QuickBtn onClick={() => addQuickUdhaarItem(500)}>+₹500</QuickBtn>
            </div>

            {items.length === 0 ? (
              <div className="mt-5 rounded-3xl bg-gray-50 p-5 text-sm text-gray-500 ring-1 ring-black/5">
                No items added yet.
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-gray-50 p-4 ring-1 ring-black/5"
                  >
                    <div className="grid gap-3 md:grid-cols-[1.3fr_0.5fr_0.6fr_auto]">
                      <input
                        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Item name"
                        value={it.name}
                        onChange={(e) => updateItem(idx, "name", e.target.value)}
                      />

                      <input
                        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Qty"
                        inputMode="numeric"
                        value={String(it.qty ?? "")}
                        onChange={(e) =>
                          updateItem(idx, "qty", e.target.value.replace(/\D/g, ""))
                        }
                      />

                      <input
                        className="w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
                        placeholder="Price"
                        inputMode="numeric"
                        value={String(it.price ?? "")}
                        onChange={(e) =>
                          updateItem(idx, "price", e.target.value.replace(/\D/g, ""))
                        }
                      />

                      <button
                        onClick={() => removeItem(idx)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 text-right text-sm font-semibold text-gray-600">
                      Total: ₹{it.total || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-3xl bg-black p-5 text-white">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Udhaar Total
              </div>
              <div className="mt-2 text-4xl font-extrabold">₹{itemsTotal}</div>
            </div>

            <button
              onClick={submitUdhaar}
              disabled={savingUdhaar}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
            >
              {savingUdhaar ? "Saving..." : "Save Udhaar"}
              {!savingUdhaar ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </div>

          {/* Payment */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-bold text-gray-900">
              <span className="inline-flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5" />
                Payment Entry
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Customer se mila hua payment yahan save karo.
            </div>

            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
              <QuickBtn onClick={() => applyQuickPayment(50)}>+50</QuickBtn>
              <QuickBtn onClick={() => applyQuickPayment(100)}>+100</QuickBtn>
              <QuickBtn onClick={() => applyQuickPayment(200)}>+200</QuickBtn>
              <QuickBtn onClick={() => applyQuickPayment(500)}>+500</QuickBtn>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <Wallet className="h-5 w-5 text-gray-400" />
                <input
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="Payment Amount (₹)"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                />
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <ReceiptText className="mt-0.5 h-5 w-5 text-gray-400" />
                <input
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={80}
                />
              </div>
            </div>

            <button
              onClick={submitPayment}
              disabled={savingPayment}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
            >
              {savingPayment ? "Saving..." : "Save Payment"}
              {!savingPayment ? <ArrowRight className="h-4 w-4" /> : null}
            </button>

            {err ? (
              <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}
          </div>
        </div>

        {/* Recent entries */}
        <div className="mt-8">
          <div className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Recent Entries
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && selectedId && ledger.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-gray-500 shadow-sm ring-1 ring-black/5">
              No entries yet.
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-2">
            {ledger.slice(0, 6).map((t) => (
              <div
                key={t._id}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <EntryBadge type={t.type} />
                    <div className="mt-3 text-sm font-bold text-gray-900">
                      {t.type === "UDAAR" ? "Udhaar Entry" : "Payment Entry"}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div
                      className={`mt-1 text-2xl font-extrabold ${
                        t.type === "UDAAR" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{t.amount}
                    </div>
                  </div>
                </div>

                {t.items?.length ? (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </div>

                    <div className="mt-3 space-y-2">
                      {t.items.slice(0, 4).map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm ring-1 ring-black/5"
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
    </div>
  );
}