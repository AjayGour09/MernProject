import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SalesAPI } from "../../services/sales.api";
import { useSearchParams } from "react-router-dom";

function todayStrClient() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

export default function Sales() {
  const [params] = useSearchParams();

  const [date, setDate] = useState(todayStrClient());
  const [cash, setCash] = useState("");
  const [upi, setUpi] = useState("");
  const [note, setNote] = useState("");
  const [list, setList] = useState([]);

  const [month, setMonth] = useState({ total: 0, cash: 0, upi: 0, days: 30 });
  const [days, setDays] = useState(30);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(() => {
    const c = Number(cash || 0);
    const u = Number(upi || 0);
    return (Number.isFinite(c) ? c : 0) + (Number.isFinite(u) ? u : 0);
  }, [cash, upi]);

  const loadToday = async () => {
    setErr("");
    try {
      const d = await SalesAPI.today();
      setDate(d.date);
      setCash(String(d.cash ?? 0));
      setUpi(String(d.upi ?? 0));
      setNote(d.note || "");
    } catch (e) {
      setErr(e.message);
    }
  };

  // ✅ Load any specific date using existing list endpoint (no backend change)
  const loadByDate = async (dateStr) => {
    setErr("");
    try {
      const data = await SalesAPI.list(60); // enough to find requested day
      const found = (data || []).find((x) => x.date === dateStr);

      if (found) {
        setDate(found.date);
        setCash(String(found.cash ?? 0));
        setUpi(String(found.upi ?? 0));
        setNote(found.note || "");
      } else {
        // If not found in DB, allow user to create entry for that date
        setDate(dateStr);
        setCash("0");
        setUpi("0");
        setNote("");
      }
    } catch (e) {
      setErr(e.message);
    }
  };

  const loadList = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await SalesAPI.list(10);
      setList(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMonth = async (d = days) => {
    try {
      const res = await SalesAPI.month(d);
      setMonth(res);
    } catch (e) {
      console.log("Month load error:", e.message);
    }
  };

  useEffect(() => {
    const qDate = params.get("date");
    if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) {
      loadByDate(qDate);
    } else {
      loadToday();
    }

    loadList();
    loadMonth(30);
    // eslint-disable-next-line
  }, []);

  const save = async () => {
    setErr("");
    const c = Number(cash || 0);
    const u = Number(upi || 0);

    console.log("[Sales] save", { date, cash: c, upi: u });

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return setErr("Valid date select karo");
    if (!Number.isFinite(c) || c < 0) return setErr("Cash >= 0");
    if (!Number.isFinite(u) || u < 0) return setErr("UPI >= 0");

    try {
      await SalesAPI.save({ date, cash: c, upi: u, note: note.trim() });
      await loadList();
      await loadMonth(days);
    } catch (e) {
      setErr(e.message);
    }
  };

  const addCash = (x) => {
    const c = Number(cash || 0);
    setCash(String(c + x));
  };
  const addUpi = (x) => {
    const u = Number(upi || 0);
    setUpi(String(u + x));
  };

  return (
    <>
      <Container
        title="Daily Sales"
        right={
          <button
            onClick={() => {
              const qDate = params.get("date");
              if (qDate && /^\d{4}-\d{2}-\d{2}$/.test(qDate)) loadByDate(qDate);
              else loadToday();

              loadList();
              loadMonth(days);
            }}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
          >
            ↻
          </button>
        }
      >
        {/* Monthly Summary */}
        <div className="rounded-2xl bg-black p-5 text-white shadow-sm">
          <div className="text-sm opacity-80">Last {days} days</div>
          <div className="mt-1 text-3xl font-extrabold">₹ {month.total}</div>
          <div className="mt-2 text-xs opacity-80">
            Cash: ₹{month.cash} • UPI: ₹{month.upi}
          </div>

          <div className="mt-4 flex gap-2">
            <Pill
              active={days === 7}
              onClick={() => {
                setDays(7);
                loadMonth(7);
              }}
            >
              7D
            </Pill>
            <Pill
              active={days === 30}
              onClick={() => {
                setDays(30);
                loadMonth(30);
              }}
            >
              30D
            </Pill>
            <Pill
              active={days === 90}
              onClick={() => {
                setDays(90);
                loadMonth(90);
              }}
            >
              90D
            </Pill>
          </div>
        </div>

        {/* Entry */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <label className="text-sm font-semibold text-gray-700">Date</label>
          <input
            type="date"
            className="mt-2 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-500">Cash (₹)</div>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                value={cash}
                onChange={(e) => setCash(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="0"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={() => addCash(100)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +100
                </button>
                <button onClick={() => addCash(200)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +200
                </button>
                <button onClick={() => addCash(500)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +500
                </button>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">UPI (₹)</div>
              <input
                inputMode="numeric"
                className="mt-1 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
                value={upi}
                onChange={(e) => setUpi(e.target.value.replace(/\D/g, "").slice(0, 8))}
                placeholder="0"
              />
              <div className="mt-2 flex gap-2">
                <button onClick={() => addUpi(100)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +100
                </button>
                <button onClick={() => addUpi(200)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +200
                </button>
                <button onClick={() => addUpi(500)} className="flex-1 rounded-xl border py-2 text-xs font-semibold">
                  +500
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-2xl border p-4">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-3xl font-extrabold">₹ {total}</div>
          </div>

          <input
            className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={120}
          />

          <button
            onClick={save}
            className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
          >
            ✅ Save Sales
          </button>

          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        {/* History */}
        <div className="mt-5">
          <div className="mb-2 text-sm font-bold text-gray-900">Last Days</div>
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          <div className="space-y-3">
            {list.map((d) => (
              <div key={d._id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold">{d.date}</div>
                  <div className="text-lg font-extrabold">₹ {d.total}</div>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Cash: ₹{d.cash} • UPI: ₹{d.upi}
                </div>
                {d.note ? <div className="mt-2 text-sm">{d.note}</div> : null}
              </div>
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}