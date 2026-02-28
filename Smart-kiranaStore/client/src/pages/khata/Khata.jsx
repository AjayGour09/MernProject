import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import { apiGet, apiPost } from "../../services/api.js";

export default function Khata() {
  const [customers, setCustomers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === selectedId),
    [customers, selectedId]
  );

  const loadCustomers = async () => {
    setErr("");
    try {
      const data = await apiGet("/customers?search=");
      setCustomers(data);
      // auto select first customer if none
      if (!selectedId && data.length) setSelectedId(data[0]._id);
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

  const submit = async (type) => {
    setErr("");
    const amt = Number(amount);

    // Frontend logs (debug)
    console.log("[Khata] submit", { type, selectedId, amount: amt });

    if (!selectedId) return setErr("Customer select karo");
    if (!Number.isFinite(amt) || amt <= 0) return setErr("Amount > 0 hona chahiye");

    try {
      await apiPost("/transactions", {
        customerId: selectedId,
        type,
        amount: amt,
        note: note.trim(),
      });

      // refresh customer list to show updated balance
      await loadCustomers();
      await loadLedger(selectedId);

      setAmount("");
      setNote("");
    } catch (e) {
      setErr(e.message);
    }
  };

  const openWhatsapp = () => {
    if (!selectedCustomer) return;
    const msg = `Namaste! Aapka Kirana Store me ₹${selectedCustomer.balance || 0} baki hai. Kripya jama kar dein.`;
    const phone = selectedCustomer.phone; // 10 digit
    // India +91
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

            <input
              className="mt-4 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Amount (₹)"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
            />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                onClick={() => submit("UDAAR")}
                className="rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
              >
                ➕ Udhaar Jodo
              </button>

              <button
                onClick={() => submit("PAYMENT")}
                className="rounded-2xl border py-3 font-semibold active:scale-[0.99]"
              >
                ✅ Paisa Mila
              </button>
            </div>

            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
          </div>
        </div>

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