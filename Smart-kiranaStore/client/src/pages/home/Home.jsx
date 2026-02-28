import { useEffect, useMemo, useState } from "react";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { SummaryAPI } from "../../services/summary.api";
import { SalesAPI } from "../../services/sales.api";
import { StockAPI } from "../../services/stock.api";
import { Link } from "react-router-dom";

function StatCard({ label, value, sub, to }) {
  const card = (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99] transition">
      <div className="text-xs font-semibold text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-extrabold text-gray-900">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
  return to ? <Link to={to}>{card}</Link> : card;
}

function ActionBtn({ to, children, variant = "dark" }) {
  const base =
    "rounded-2xl px-4 py-4 text-center font-semibold shadow-sm ring-1 ring-black/5 active:scale-[0.99] transition";
  const cls =
    variant === "dark"
      ? `${base} bg-black text-white`
      : `${base} bg-white text-gray-900`;
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900">Details</div>
          <button
            onClick={onClose}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
          >
            ✖ Close
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayDate: "",
  });

  const [trend, setTrend] = useState([]); // last 7 days (oldest -> newest)
  const [topLow, setTopLow] = useState([]); // top 3 low stock
  const [selectedDay, setSelectedDay] = useState(null); // popup
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const trendMax = useMemo(() => {
    const totals = trend.map((d) => Number(d.total || 0));
    return Math.max(...totals, 1);
  }, [trend]);

  const total7d = useMemo(
    () => trend.reduce((s, x) => s + Number(x.total || 0), 0),
    [trend]
  );

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      const [sum, last7, low] = await Promise.all([
        SummaryAPI.get(),
        SalesAPI.list(7),
        StockAPI.low(),
      ]);

      setData(sum);

      const arr = (last7 || []).slice().reverse(); // oldest -> newest
      setTrend(arr);

      setTopLow((low || []).slice(0, 3));
    } catch (e) {
      setErr(e.message || "Dashboard load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Container
        title="Dashboard"
        right={
          <button
            onClick={load}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
          >
            ↻ Refresh
          </button>
        }
      >
        {/* Hero Header */}
        <div className="rounded-2xl bg-black p-5 text-white shadow-sm">
          <div className="text-sm opacity-80">Smart Kirana</div>
          <div className="mt-1 text-2xl font-extrabold">Aaj ka status 👇</div>
          {data.todayDate ? (
            <div className="mt-2 text-xs opacity-80">Date: {data.todayDate}</div>
          ) : null}
          {loading ? <div className="mt-2 text-xs opacity-80">Loading…</div> : null}
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            label="Today Sales"
            value={`₹ ${data.todaySales}`}
            sub="Cash + UPI"
            to="/sales"
          />
          <StatCard
            label="Low Stock"
            value={data.lowStockCount}
            sub="Qty ≤ MinStock"
            to="/stock"
          />
          <StatCard
            label="Total Baki"
            value={`₹ ${data.totalBaki}`}
            sub="Udhaar total"
            to="/khata"
          />
          <StatCard
            label="Customers"
            value={data.totalCustomers}
            sub="Total count"
            to="/customers"
          />
        </div>

        {/* Last 7 days trend */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">Last 7 Days Sales</div>
            <Link to="/sales" className="text-xs font-semibold text-gray-600 underline">
              View
            </Link>
          </div>

          {trend.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">No sales data yet.</div>
          ) : (
            <>
              <div className="mt-4 flex items-end gap-2">
                {trend.map((d, idx) => {
                  const h = Math.round(((Number(d.total || 0) / trendMax) * 48) + 6);
                  const label = String(d.date || "").slice(5); // MM-DD
                  return (
                    <button
                      key={d._id || idx}
                      onClick={() => setSelectedDay(d)}
                      className="flex flex-1 flex-col items-center gap-2 active:scale-[0.99] transition"
                      title="Tap for details"
                    >
                      <div className="w-full rounded-xl bg-black" style={{ height: `${h}px` }} />
                      <div className="text-[10px] font-semibold text-gray-500">{label}</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-gray-600">
                Total (7D): <b>₹{total7d}</b>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                Tip: Bar pe tap karo to details open hoga.
              </div>
            </>
          )}
        </div>

        {/* Top 3 low stock items */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">Top Low Stock</div>
            <Link to="/stock" className="text-xs font-semibold text-gray-600 underline">
              View
            </Link>
          </div>

          {topLow.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">Low stock items nahi hain ✅</div>
          ) : (
            <div className="mt-3 space-y-2">
              {topLow.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-600">
                      Min: {p.minStock} • Unit: {p.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Qty</div>
                    <div className="text-lg font-extrabold text-gray-900">{p.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-5">
          <div className="mb-2 text-sm font-bold text-gray-900">Quick Actions</div>
          <div className="grid gap-3">
            <ActionBtn to="/khata" variant="dark">
              📒 Khata (Udhaar / Payment)
            </ActionBtn>

            <div className="grid grid-cols-2 gap-3">
              <ActionBtn to="/sales" variant="light">
                💰 Daily Sales
              </ActionBtn>
              <ActionBtn to="/stock" variant="light">
                📦 Stock
              </ActionBtn>
            </div>

            <ActionBtn to="/customers" variant="light">
              👤 Customers
            </ActionBtn>
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-red-600 shadow-sm ring-1 ring-black/5">
            {err}
          </div>
        ) : null}
      </Container>

      <BottomNav />

      {/* Trend bar popup */}
      <Modal open={!!selectedDay} onClose={() => setSelectedDay(null)}>
        {selectedDay ? (
          <div className="space-y-3">
            <div className="rounded-2xl border p-4">
              <div className="text-xs text-gray-500">Date</div>
              <div className="text-lg font-extrabold text-gray-900">
                {selectedDay.date}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">Cash</div>
                <div className="text-xl font-extrabold">₹ {selectedDay.cash}</div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">UPI</div>
                <div className="text-xl font-extrabold">₹ {selectedDay.upi}</div>
              </div>
            </div>

            <div className="rounded-2xl bg-black p-4 text-white">
              <div className="text-xs opacity-80">Total</div>
              <div className="text-3xl font-extrabold">₹ {selectedDay.total}</div>
            </div>

            {/* ✅ IMPORTANT CHANGE: go to sales with date */}
            <Link
              to={`/sales?date=${selectedDay.date}`}
              onClick={() => setSelectedDay(null)}
              className="block w-full rounded-2xl bg-black py-3 text-center font-semibold text-white active:scale-[0.99]"
            >
              Edit this day in Sales
            </Link>
          </div>
        ) : null}
      </Modal>
    </>
  );
}