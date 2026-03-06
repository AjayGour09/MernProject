import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SalesAPI } from "../../services/sales.api";

function Pill({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-3 text-sm font-semibold active:scale-[0.99] transition ${
        active ? "bg-white text-black" : "bg-white/90 text-black"
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
      className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99] transition"
    >
      {children}
    </button>
  );
}

function money(v) {
  return `₹ ${Number(v || 0)}`;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function Sales() {
  const [range, setRange] = useState(30); // 7 | 30 | 90
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

  const total = useMemo(() => {
    return Number(cash || 0) + Number(upi || 0);
  }, [cash, upi]);

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const [days, monthSummary] = await Promise.all([
        SalesAPI.list(range),
        SalesAPI.month(range),
      ]);

      setList(Array.isArray(days) ? days : []);

      setSummary(
        monthSummary || {
          total: 0,
          cash: 0,
          upi: 0,
        }
      );
    } catch (e) {
      setErr(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [range]);

  const addCash = (v) => {
    setCash(String(Number(cash || 0) + v));
  };

  const addUpi = (v) => {
    setUpi(String(Number(upi || 0) + v));
  };

  const saveSales = async () => {
    setErr("");

    const c = Number(cash || 0);
    const u = Number(upi || 0);

    if (!date) return setErr("Date required");
    if (!Number.isFinite(c) || c < 0) return setErr("Cash invalid");
    if (!Number.isFinite(u) || u < 0) return setErr("UPI invalid");

    // optional safety
    if (c > 10000000 || u > 10000000) {
      return setErr("Value too large");
    }

    setSaving(true);
    try {
      await SalesAPI.save({
        date,
        cash: c,
        upi: u,
        note: note.trim(),
      });

      // ✅ form clear after save
      setCash("");
      setUpi("");
      setNote("");

      // ✅ refresh summary + list
      await load();

      alert("Sales saved ✅");
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Container title="Sales">
        {/* Summary */}
        <div className="rounded-2xl bg-black p-5 text-white shadow-sm">
          <div className="text-sm opacity-80">Last {range} days</div>

          <div className="mt-2 text-4xl font-extrabold">
            {money(summary.total)}
          </div>

          <div className="mt-2 text-sm opacity-90">
            Cash: {money(summary.cash)} • UPI: {money(summary.upi)}
          </div>

          <div className="mt-5 flex gap-3">
            <Pill active={range === 7} onClick={() => setRange(7)}>
              7D
            </Pill>
            <Pill active={range === 30} onClick={() => setRange(30)}>
              30D
            </Pill>
            <Pill active={range === 90} onClick={() => setRange(90)}>
              90D
            </Pill>
          </div>
        </div>

        {/* Entry Form */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow ring-1 ring-black/5">
          <div className="text-sm font-bold text-gray-900">Date</div>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <div className="mb-2 text-sm text-gray-600">Cash (₹)</div>
              <input
                value={cash}
                onChange={(e) =>
                  setCash(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                placeholder="Cash"
                inputMode="numeric"
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              />

              <div className="mt-2 flex gap-2">
                <QuickBtn onClick={() => addCash(100)}>+100</QuickBtn>
                <QuickBtn onClick={() => addCash(200)}>+200</QuickBtn>
                <QuickBtn onClick={() => addCash(500)}>+500</QuickBtn>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm text-gray-600">UPI (₹)</div>
              <input
                value={upi}
                onChange={(e) =>
                  setUpi(e.target.value.replace(/\D/g, "").slice(0, 9))
                }
                placeholder="UPI"
                inputMode="numeric"
                className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              />

              <div className="mt-2 flex gap-2">
                <QuickBtn onClick={() => addUpi(100)}>+100</QuickBtn>
                <QuickBtn onClick={() => addUpi(200)}>+200</QuickBtn>
                <QuickBtn onClick={() => addUpi(500)}>+500</QuickBtn>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border bg-gray-50 p-4">
            <div className="text-xs text-gray-500">Total</div>
            <div className="mt-1 text-4xl font-extrabold">{money(total)}</div>
          </div>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            maxLength={120}
            className="mt-4 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={saveSales}
            disabled={saving}
            className="mt-4 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99] transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "✅ Save Sales"}
          </button>

          {err ? (
            <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        {/* Last Days */}
        <div className="mt-5">
          <div className="mb-2 text-sm font-bold text-gray-900">Last Days</div>

          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {!loading && list.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow ring-1 ring-black/5">
              No sales yet.
            </div>
          ) : null}

          <div className="space-y-3">
            {list.map((d) => (
              <div
                key={d._id || d.date}
                className="rounded-2xl bg-white p-4 shadow ring-1 ring-black/5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-gray-900">
                    {d.date}
                  </div>
                  <div className="text-2xl font-extrabold">
                    {money(d.total)}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  Cash={money(d.cash)} • UPI={money(d.upi)}
                </div>

                {d.note ? (
                  <div className="mt-2 text-sm text-gray-700">{d.note}</div>
                ) : null}

                <button
                  onClick={() => {
                    setDate(d.date);
                    setCash(String(d.cash || ""));
                    setUpi(String(d.upi || ""));
                    setNote(d.note || "");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="mt-3 rounded-xl border px-3 py-2 text-sm font-semibold active:scale-[0.99]"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}