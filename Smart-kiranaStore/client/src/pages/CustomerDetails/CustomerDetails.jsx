import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet } from "../../services/api";
import { AuthService } from "../../services/auth";

function Pill({ active, onClick, children }) {
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

function formatBalance(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      value: `₹${b}`,
      heroCls: "text-red-300",
      amountCls: "text-red-600",
      badge: "bg-red-50 text-red-700",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      heroCls: "text-green-300",
      amountCls: "text-green-600",
      badge: "bg-green-50 text-green-700",
    };
  }

  return {
    label: "Status",
    value: "Clear",
    heroCls: "text-white",
    amountCls: "text-gray-700",
    badge: "bg-gray-100 text-gray-700",
  };
}

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = AuthService.getSelectedShop();

  const [customer, setCustomer] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [filter, setFilter] = useState("ALL");
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
        apiGet(`/customers/${id}?shopId=${shop._id}`),
        apiGet(`/transactions/${id}?shopId=${shop._id}`),
      ]);

      setCustomer(c);
      setLedger(Array.isArray(tx) ? tx : []);
    } catch (e) {
      setErr(e.message || "Failed to load customer");
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
  }, [id, shop?._id]);

  const balanceUI = formatBalance(customer?.balance || 0);

  return (
    <>
      <Container
        title="Customer Details"
        subtitle={shop?.shopName || "Smart Kirana"}
        right={
          <button
            onClick={load}
            className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-gray-800 ring-1 ring-black/5 transition hover:bg-gray-50"
          >
            Refresh
          </button>
        }
      >
        {err ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
            {err}
          </div>
        ) : null}

        <div className="rounded-[30px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/70">Customer Profile</div>

          <div className="mt-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-3xl font-extrabold tracking-tight">
                {customer?.name || "Loading..."}
              </div>
              <div className="mt-1 text-sm text-white/70">
                {customer?.phone || ""}
              </div>

              <div
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  balanceUI.label === "Baki"
                    ? "bg-red-400/20 text-red-200"
                    : balanceUI.label === "Advance"
                    ? "bg-green-400/20 text-green-200"
                    : "bg-white/10 text-white/80"
                }`}
              >
                {balanceUI.label}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Balance
              </div>
              <div className={`mt-1 text-3xl font-extrabold ${balanceUI.heroCls}`}>
                {balanceUI.value}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <Link
              to={`/khata?customerId=${id}`}
              className="rounded-2xl bg-white py-3 text-center text-sm font-bold text-black transition hover:bg-gray-100"
            >
              Add Entry
            </Link>

            <Link
              to="/customers"
              className="rounded-2xl border border-white/15 bg-white/10 py-3 text-center text-sm font-bold text-white transition hover:bg-white/15"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="rounded-[30px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">History Filters</div>

          <div className="mt-4 flex flex-wrap gap-2">
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
        </div>

        <div>
          <div className="mb-3 text-base font-bold text-gray-900">History</div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && filtered.length === 0 ? (
            <div className="rounded-[28px] bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No history yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {filtered.map((t) => (
              <div
                key={t._id}
                className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {t.type === "UDAAR" ? "Udhaar Entry" : "Payment Entry"}
                    </div>

                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleString()}
                    </div>

                    <div
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        t.type === "UDAAR"
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {t.type}
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

                {Array.isArray(t.items) && t.items.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-500">
                      Items
                    </div>

                    <div className="mt-2 space-y-2">
                      {t.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <div className="min-w-0 text-gray-800">
                            <span className="font-medium">{it.name}</span>
                            <span className="text-gray-500"> × {it.qty}</span>
                            <span className="text-xs text-gray-500">
                              {" "}
                              (₹{it.price}/unit)
                            </span>
                          </div>

                          <div className="shrink-0 font-semibold text-gray-900">
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