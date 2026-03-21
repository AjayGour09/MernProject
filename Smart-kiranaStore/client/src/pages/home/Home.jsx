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
  CalendarDays,
  Filter,
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
          <div className="mt-3 text-3xl font-black text-slate-900">
            {value}
          </div>
          <div className="mt-2 text-sm text-slate-500">{sub}</div>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tones[tone]}`}>
          {icon}
        </div>
      </div>

      {to && (
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
          Open
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export default function Home() {
  const navigate = useNavigate();
  const user = AuthService.getUser();
  const shop = AuthService.getSelectedShop();

  const [data, setData] = useState({
    totalCustomers: 0,
    totalBaki: 0,
    totalSales: 0,
    totalPayment: 0,
    lowStockCount: 0,
  });

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    type: "ALL",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = await SummaryAPI.get(filters);
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

  return (
    <>
      <BottomNav />

      <Container
        title="Dashboard"
        subtitle="Overview of your shop performance"
        right={
          <button
            onClick={load}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      >
        {/* 🔥 HERO */}
        <div className="rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white mb-6">
          <h2 className="text-3xl font-black">
            {shop?.shopName}
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {user?.name} • {user?.email}
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Sales</p>
              <h1 className="text-3xl font-bold">₹{data.totalSales}</h1>
            </div>

            <div>
              <p className="text-sm text-gray-400">Payments</p>
              <h1 className="text-3xl font-bold">₹{data.totalPayment}</h1>
            </div>

            <div>
              <p className="text-sm text-gray-400">Net</p>
              <h1 className="text-3xl font-bold">
                ₹{data.totalSales - data.totalPayment}
              </h1>
            </div>
          </div>
        </div>

        {/* 🔥 FILTER BAR */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border">
            <CalendarDays className="h-4 w-4" />
            <input
              type="date"
              value={filters.from}
              onChange={(e) =>
                setFilters({ ...filters, from: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border">
            <CalendarDays className="h-4 w-4" />
            <input
              type="date"
              value={filters.to}
              onChange={(e) =>
                setFilters({ ...filters, to: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border">
            <Filter className="h-4 w-4" />
            <select
              value={filters.type}
              onChange={(e) =>
                setFilters({ ...filters, type: e.target.value })
              }
            >
              <option value="ALL">All</option>
              <option value="UDHAAR">Udhaar</option>
              <option value="PAYMENT">Payment</option>
            </select>
          </div>

          <button
            onClick={load}
            className="bg-black text-white px-4 py-2 rounded-xl"
          >
            Apply
          </button>
        </div>

        {/* 🔥 STATS */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Customers"
            value={data.totalCustomers}
            sub="Total customers"
            tone="blue"
            to="/customers"
            icon={<Users className="h-5 w-5" />}
          />

          <StatCard
            title="Total Baki"
            value={`₹${data.totalBaki}`}
            sub="Pending amount"
            tone="red"
            to="/khata"
            icon={<Wallet className="h-5 w-5" />}
          />

          <StatCard
            title="Sales"
            value={`₹${data.totalSales}`}
            sub="Udhaar"
            tone="green"
            to="/sales"
            icon={<BadgeIndianRupee className="h-5 w-5" />}
          />

          <StatCard
            title="Payments"
            value={`₹${data.totalPayment}`}
            sub="Received"
            tone="amber"
            icon={<Boxes className="h-5 w-5" />}
          />
        </div>

        {err && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-xl">
            {err}
          </div>
        )}
      </Container>
    </>
  );
}