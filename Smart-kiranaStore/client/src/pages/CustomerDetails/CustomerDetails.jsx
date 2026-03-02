// client/src/pages/CustomerDetails/CustomerDetails.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet } from "../../services/api";

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

export default function CustomerDetails() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | UDAAR | PAYMENT
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const filtered = useMemo(() => {
    if (filter === "ALL") return ledger;
    return ledger.filter((t) => t.type === filter);
  }, [ledger, filter]);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [c, tx] = await Promise.all([
        apiGet(`/customers/${id}`),
        apiGet(`/transactions/${id}`),
      ]);
      setCustomer(c);
      setLedger(tx);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  const sendReminder = () => {
    if (!customer?.phone) return alert("Phone missing");

    const amount = Number(customer?.balance || 0);
    if (!Number.isFinite(amount) || amount <= 0) return alert("No pending baki");

    const phone10 = String(customer.phone).replace(/\D/g, "").slice(-10);
    if (phone10.length !== 10) return alert("Invalid phone number");

    const msg = `Namaste ${customer.name || "Customer"} ji,\n\nAapka ₹${amount} baki hai.\nKripya payment kar dein.\n\n- Smart Kirana`;
    window.open(
      `https://wa.me/91${phone10}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return (
    <>
      <Container
        title="Customer History"
        right={
          <button
            onClick={load}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
          >
            ↻
          </button>
        }
      >
        {err ? (
          <div className="rounded-2xl bg-white p-4 text-sm text-red-600 shadow-sm ring-1 ring-black/5">
            {err}
          </div>
        ) : null}

        {/* Customer card */}
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-lg font-extrabold truncate">
                {customer?.name || "Loading..."}
              </div>
              <div className="text-sm text-gray-600">{customer?.phone || ""}</div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">Baki</div>
              <div className="text-2xl font-extrabold">
                ₹{customer?.balance ?? 0}
              </div>
            </div>
          </div>

          {/* ✅ AUTO-SELECT on Khata using query param */}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Link
              to={`/khata?customerId=${id}`}
              className="rounded-2xl bg-black py-3 text-center font-semibold text-white active:scale-[0.99]"
            >
              📒 Add Entry
            </Link>

            <button
              onClick={sendReminder}
              className="rounded-2xl bg-green-600 py-3 font-semibold text-white active:scale-[0.99]"
              disabled={!customer || (customer?.balance ?? 0) <= 0}
            >
              📲 WhatsApp
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2">
          <Pill active={filter === "ALL"} onClick={() => setFilter("ALL")}>
            All
          </Pill>
          <Pill active={filter === "UDAAR"} onClick={() => setFilter("UDAAR")}>
            Udhaar
          </Pill>
          <Pill active={filter === "PAYMENT"} onClick={() => setFilter("PAYMENT")}>
            Payment
          </Pill>
        </div>

        {/* Ledger */}
        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {filtered.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">
                  {t.type === "UDAAR" ? "➕ Udhaar" : "✅ Payment"}
                </div>
                <div className="text-lg font-extrabold">₹{t.amount}</div>
              </div>

              <div className="mt-1 text-xs text-gray-500">
                {new Date(t.createdAt).toLocaleString()}
              </div>

              {/* ✅ Items show */}
              {Array.isArray(t.items) && t.items.length > 0 ? (
                <div className="mt-3 rounded-2xl border p-3">
                  <div className="text-xs font-bold text-gray-700">Items</div>

                  <div className="mt-2 space-y-1">
                    {t.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="text-gray-800">
                          {it.name} × {it.qty}
                          <span className="text-xs text-gray-500">
                            {" "}
                            (₹{it.price}/unit)
                          </span>
                        </div>
                        <div className="font-semibold">₹{it.total}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {t.note ? (
                <div className="mt-2 text-sm text-gray-700">{t.note}</div>
              ) : null}
            </div>
          ))}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow-sm ring-1 ring-black/5">
              No history yet.
            </div>
          ) : null}
        </div>
      </Container>

      <BottomNav />
    </>
  );
}