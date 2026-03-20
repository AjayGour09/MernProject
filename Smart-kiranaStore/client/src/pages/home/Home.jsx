import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  Wallet,
  Boxes,
  BadgeIndianRupee,
  RefreshCw,
  Store,
  ChevronRight,
  ArrowUpRight,
  Phone,
  MapPin,
} from "lucide-react";
import { SummaryAPI } from "../../services/summary.api";
import { AuthService } from "../../services/auth";
import BottomNav from "../../components/BottomNav";
import Container from "../../components/Container";

function StatCard({ title, value, sub, icon, tone = "slate", to }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
  };

  const content = (
    <div className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-500">{title}</div>
          <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </div>
          <div className="mt-2 text-sm text-slate-500">{sub}</div>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          {icon}
        </div>
      </div>

      {to ? (
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
          Open
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      ) : null}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

function ActionTile({ to, title, desc, emoji }) {
  return (
    <Link
      to={to}
      className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="text-2xl">{emoji}</div>
      <div className="mt-4 text-lg font-black tracking-tight text-slate-900">
        {title}
      </div>
      <div className="mt-2 text-sm leading-7 text-slate-500">{desc}</div>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
        Open
        <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const user = AuthService.getUser();
  const shop = AuthService.getSelectedShop();

  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayDate: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = await SummaryAPI.get();
      setData(res);
    } catch (e) {
      setErr(e.message || "Summary load failed");
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
  }, [shop?._id]);

  const changeShop = () => {
    navigate("/shops");
  };

  return (
    <>
      <BottomNav />

      <Container
        title="Dashboard"
        subtitle="Overview of your shop performance and daily activity"
        right={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      >
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[32px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-lg md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Store className="h-4 w-4" />
              Smart Kirana Admin
            </div>

            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              {shop?.shopName || "My Shop"}
            </h2>

            <div className="mt-5 flex flex-col gap-2 text-sm text-white/75">
              <div>{user?.name || "Admin"} {user?.email ? `• ${user.email}` : ""}</div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {shop?.phone || "No phone"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {shop?.address || "No address"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Today Sales
                </div>
                <div className="mt-2 text-4xl font-black">₹{data.todaySales}</div>
                <div className="mt-2 text-sm text-white/70">
                  Latest saved amount for the day
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-white/60">
                  Today Date
                </div>
                <div className="mt-2 text-2xl font-black">
                  {data.todayDate || "-"}
                </div>
                <div className="mt-2 text-sm text-white/70">
                  Live summary date
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
              Quick Control
            </div>

            <div className="mt-4 text-2xl font-black tracking-tight text-slate-900">
              Switch and manage
            </div>

            <div className="mt-3 text-sm leading-7 text-slate-500">
              Move between different shop sections and keep daily operations under control.
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={changeShop}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">Change Shop</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Open another created shop
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </button>

              <Link
                to="/customers"
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">Manage Customers</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Add, view and manage balances
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>

              <Link
                to="/khata"
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-4 transition hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">Open Khata</div>
                  <div className="mt-1 text-sm text-slate-500">
                    Save udhaar and payments
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            title="Today Sales"
            value={`₹${data.todaySales}`}
            sub="Cash + UPI summary"
            tone="green"
            to="/sales"
            icon={<BadgeIndianRupee className="h-5 w-5" />}
          />

          <StatCard
            title="Total Customers"
            value={data.totalCustomers}
            sub="Linked customer accounts"
            tone="blue"
            to="/customers"
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            title="Total Baki"
            value={`₹${data.totalBaki}`}
            sub="Outstanding khata balance"
            tone="red"
            to="/khata"
            icon={<Wallet className="h-5 w-5" />}
          />

          <StatCard
            title="Low Stock"
            value={data.lowStockCount}
            sub="Items needing attention"
            tone="amber"
            to="/stock"
            icon={<Boxes className="h-5 w-5" />}
          />
        </div>

        <div>
          <div className="mb-4 text-2xl font-black tracking-tight text-slate-900">
            Quick Actions
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <ActionTile
              to="/customers"
              title="Customers"
              desc="Add customers, open details and view balances quickly."
              emoji="👥"
            />

            <ActionTile
              to="/khata"
              title="Khata"
              desc="Save udhaar items and payment entries in one place."
              emoji="📒"
            />

            <ActionTile
              to="/stock"
              title="Stock"
              desc="Track products, refill low stock and update quantities."
              emoji="📦"
            />

            <ActionTile
              to="/sales"
              title="Sales"
              desc="Store daily cash and UPI sales with date-wise history."
              emoji="💰"
            />
          </div>
        </div>

        {err ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}
      </Container>
    </>
  );
}