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

function ActionBtn({ to, icon, title, sub, dark = false }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-4 shadow-sm ring-1 ring-black/5 active:scale-[0.99] transition ${
        dark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-xl ${
            dark ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-base font-bold">{title}</div>
          <div
            className={`mt-1 text-xs ${
              dark ? "text-white/75" : "text-gray-500"
            }`}
          >
            {sub}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-gray-900">Sales Details</div>
          <button
            onClick={onClose}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
          >
            ✖
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function money(v) {
  return `₹ ${Number(v || 0)}`;
}

export default function Home() {
  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayDate: "",
  });

  const [trend, setTrend] = useState([]);
  const [topLow, setTopLow] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
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

      const arr = (last7 || []).slice().reverse();
      setTrend(arr);

      const lowList = (low || []).slice(0, 3).map((p) => ({
        ...p,
        need: Math.max(Number(p.minStock || 0) - Number(p.qty || 0), 0),
      }));
      setTopLow(lowList);
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
        {/* Hero summary */}
        <div className="rounded-2xl bg-black p-5 text-white shadow-sm">
          <div className="text-sm opacity-80">Smart Kirana</div>
          <div className="mt-1 text-2xl font-extrabold">Aaj ka Summary</div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-[11px] opacity-80">Today Sales</div>
              <div className="mt-1 text-xl font-extrabold">
                {money(data.todaySales)}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-[11px] opacity-80">Low Stock</div>
              <div className="mt-1 text-xl font-extrabold">
                {data.lowStockCount}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-3">
              <div className="text-[11px] opacity-80">Total Baki</div>
              <div className="mt-1 text-xl font-extrabold">
                {money(data.totalBaki)}
              </div>
            </div>
          </div>

          {data.todayDate ? (
            <div className="mt-3 text-xs opacity-80">Date: {data.todayDate}</div>
          ) : null}

          {loading ? <div className="mt-2 text-xs opacity-80">Loading…</div> : null}
        </div>

        {/* Stats cards */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatCard
            label="Today Sales"
            value={money(data.todaySales)}
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
            value={money(data.totalBaki)}
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

        {/* Trend */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">Last 7 Days Sales</div>
            <Link
              to="/sales"
              className="text-xs font-semibold text-gray-600 underline"
            >
              View
            </Link>
          </div>

          {trend.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">No sales data yet.</div>
          ) : (
            <>
              <div className="mt-4 flex items-end gap-2">
                {trend.map((d, idx) => {
                  const total = Number(d.total || 0);
                  const h = Math.max(14, Math.round((total / trendMax) * 90));
                  const label = String(d.date || "").slice(5);

                  return (
                    <button
                      key={d._id || idx}
                      onClick={() => setSelectedDay(d)}
                      className="flex flex-1 flex-col items-center gap-2 active:scale-[0.99] transition"
                      title="Tap for details"
                    >
                      <div className="w-full rounded-t-2xl rounded-b-md bg-black pt-2 text-center text-[10px] font-semibold text-white">
                        {total > 0 ? `₹${total}` : ""}
                      </div>
                      <div
                        className="w-full rounded-xl bg-black"
                        style={{ height: `${h}px` }}
                      />
                      <div className="text-[10px] font-semibold text-gray-500">
                        {label}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-gray-600">
                Total (7D): <b>{money(total7d)}</b>
              </div>
              <div className="mt-1 text-[11px] text-gray-500">
                Tip: Bar tap karo to details open hoga.
              </div>
            </>
          )}
        </div>

        {/* Top low stock */}
        <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-gray-900">Top Low Stock</div>
            <Link
              to="/stock"
              className="text-xs font-semibold text-gray-600 underline"
            >
              View
            </Link>
          </div>

          {topLow.length === 0 ? (
            <div className="mt-3 text-sm text-gray-600">
              Low stock items nahi hain ✅
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {topLow.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between rounded-2xl border bg-white px-4 py-3"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Min: {p.minStock} • Unit: {p.unit} • Need:{" "}
                      <b>{p.need}</b>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500">Qty</div>
                    <div className="text-lg font-extrabold text-red-700">
                      {p.qty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions improved */}
        <div className="mt-5">
          <div className="mb-2 text-sm font-bold text-gray-900">
            Quick Actions
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ActionBtn
              to="/khata"
              icon="📒"
              title="Khata"
              sub="Udhaar aur payment"
              dark
            />
            <ActionBtn
              to="/sales"
              icon="💰"
              title="Sales"
              sub="Aaj ki sale entry"
            />
            <ActionBtn
              to="/stock"
              icon="📦"
              title="Stock"
              sub="Maal aur low stock"
            />
            <ActionBtn
              to="/customers"
              icon="👤"
              title="Customers"
              sub="List aur history"
            />
          </div>
        </div>

        {err ? (
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm text-red-600 shadow-sm ring-1 ring-black/5">
            {err}
          </div>
        ) : null}
      </Container>

      <BottomNav />

      {/* Sales detail modal */}
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
                <div className="text-xl font-extrabold">
                  {money(selectedDay.cash)}
                </div>
              </div>
              <div className="rounded-2xl border p-4">
                <div className="text-xs text-gray-500">UPI</div>
                <div className="text-xl font-extrabold">
                  {money(selectedDay.upi)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-black p-4 text-white">
              <div className="text-xs opacity-80">Total</div>
              <div className="text-3xl font-extrabold">
                {money(selectedDay.total)}
              </div>
            </div>

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