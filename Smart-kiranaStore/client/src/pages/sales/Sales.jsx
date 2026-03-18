import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SalesAPI } from "../../services/sales.api";
import { AuthService } from "../../services/auth";

function RangeBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-black text-white shadow-sm"
          : "bg-white text-gray-700 ring-1 ring-black/5 hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function QuickBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 ring-1 ring-black/5 transition hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

function money(v) {
  return `₹${Number(v || 0)}`;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Sales() {
  const navigate = useNavigate();
  const shop = AuthService.getSelectedShop();

  const [range, setRange] = useState(30);
  const [date, setDate] = useState(todayStr());
  const [cash, setCash] = useState("");
  const [upi, setUpi] = useState("");
  const [note, setNote] = useState("");

  const [summary, setSummary] = useState({
    total: 0,
    cash: 0,
    upi: 0,
  });

  const [list, setList] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const total = useMemo(
    () => Number(cash || 0) + Number(upi || 0),
    [cash, upi]
  );

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const [days, rangeSummary] = await Promise.all([
        SalesAPI.list(range),
        SalesAPI.month(range),
      ]);

      setList(Array.isArray(days) ? days : []);
      setSummary(rangeSummary || { total: 0, cash: 0, upi: 0 });
    } catch (e) {
      setErr(e.message || "Load failed");
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
  }, [shop?._id, range]);

  const addCash = (v) => setCash(String(Number(cash || 0) + v));
  const addUpi = (v) => setUpi(String(Number(upi || 0) + v));

  const saveSales = async () => {
    setErr("");

    const c = Number(cash || 0);
    const u = Number(upi || 0);

    if (!date) return setErr("Date required");
    if (!Number.isFinite(c) || c < 0) return setErr("Cash invalid");
    if (!Number.isFinite(u) || u < 0) return setErr("UPI invalid");

    setSaving(true);

    try {
      await SalesAPI.save({
        date,
        cash: c,
        upi: u,
        note: note.trim(),
      });

      setCash("");
      setUpi("");
      setNote("");
      await load();
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Container title="Sales">
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/70">
            {shop?.shopName || "Smart Kirana"}
          </div>

          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {money(summary.total)}
          </div>

          <div className="mt-2 flex flex-wrap gap-3 text-sm text-white/80">
            <span>Cash: {money(summary.cash)}</span>
            <span>UPI: {money(summary.upi)}</span>
          </div>

          <div className="mt-5 flex gap-2">
            <RangeBtn active={range === 7} onClick={() => setRange(7)}>
              7 Days
            </RangeBtn>
            <RangeBtn active={range === 30} onClick={() => setRange(30)}>
              30 Days
            </RangeBtn>
            <RangeBtn active={range === 90} onClick={() => setRange(90)}>
              90 Days
            </RangeBtn>
          </div>
        </div>

        <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">
            Add Daily Sales
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
              <div className="text-sm font-semibold text-gray-700">
                Cash Sales
              </div>

              <input
                value={cash}
                onChange={(e) =>
                  setCash(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                placeholder="Enter cash amount"
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <QuickBtn onClick={() => addCash(100)}>+100</QuickBtn>
                <QuickBtn onClick={() => addCash(200)}>+200</QuickBtn>
                <QuickBtn onClick={() => addCash(500)}>+500</QuickBtn>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
              <div className="text-sm font-semibold text-gray-700">
                UPI Sales
              </div>

              <input
                value={upi}
                onChange={(e) =>
                  setUpi(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                placeholder="Enter UPI amount"
                inputMode="numeric"
                className="mt-3 w-full rounded-2xl border bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <QuickBtn onClick={() => addUpi(100)}>+100</QuickBtn>
                <QuickBtn onClick={() => addUpi(200)}>+200</QuickBtn>
                <QuickBtn onClick={() => addUpi(500)}>+500</QuickBtn>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-3xl bg-black p-4 text-white">
            <div className="text-xs uppercase tracking-wide text-white/60">
              Total Sales
            </div>
            <div className="mt-1 text-4xl font-extrabold">{money(total)}</div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-600">
              Note
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              maxLength={120}
              className="mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            onClick={saveSales}
            disabled={saving}
            className="mt-4 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
          >
            {saving ? "Saving..." : "✅ Save Sales"}
          </button>

          {err ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        <div className="mt-5">
          <div className="mb-3 text-base font-bold text-gray-900">
            Sales History
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && list.length === 0 ? (
            <div className="rounded-3xl bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No sales yet.
            </div>
          ) : null}

          <div className="space-y-4">
            {list.map((d) => (
              <div
                key={d._id || d.date}
                className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="text-lg font-bold text-gray-900">
                      {d.date}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="text-2xl font-extrabold text-gray-900">
                      {money(d.total)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs text-gray-500">Cash</div>
                    <div className="mt-1 text-lg font-bold text-green-700">
                      {money(d.cash)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-3 ring-1 ring-black/5">
                    <div className="text-xs text-gray-500">UPI</div>
                    <div className="mt-1 text-lg font-bold text-blue-700">
                      {money(d.upi)}
                    </div>
                  </div>
                </div>

                {d.note ? (
                  <div className="mt-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700 ring-1 ring-black/5">
                    {d.note}
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