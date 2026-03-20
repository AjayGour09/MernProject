import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Phone,
  User,
  Users,
  ArrowRight,
} from "lucide-react";

import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet, apiPost } from "../../services/api";
import { AuthService } from "../../services/auth";

function formatBalance(balance) {
  const b = Number(balance || 0);

  if (b > 0) {
    return {
      label: "Baki",
      value: `₹${b}`,
      cls: "text-red-600",
      badge: "bg-red-50 text-red-700",
    };
  }

  if (b < 0) {
    return {
      label: "Advance",
      value: `₹${Math.abs(b)}`,
      cls: "text-green-600",
      badge: "bg-green-50 text-green-700",
    };
  }

  return {
    label: "Clear",
    value: "₹0",
    cls: "text-gray-700",
    badge: "bg-gray-100 text-gray-700",
  };
}

function CustomerCard({ customer }) {
  const balanceUI = formatBalance(customer.balance);

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-extrabold tracking-tight text-gray-900">
            {customer.name}
          </div>

          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Phone className="h-4 w-4" />
            {customer.phone}
          </div>

          <div
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${balanceUI.badge}`}
          >
            {balanceUI.label}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Balance</div>
          <div className={`mt-1 text-2xl font-extrabold ${balanceUI.cls}`}>
            {balanceUI.value}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link
          to={`/customers/${customer._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-50"
        >
          View History
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to={`/khata?customerId=${customer._id}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
        >
          Open Khata
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function Customers() {
  const navigate = useNavigate();
  const shop = AuthService.getSelectedShop();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = async (q = search) => {
    if (!shop?._id) return;

    setLoading(true);
    setErr("");

    try {
      const data = await apiGet(
        `/customers?shopId=${shop._id}&search=${encodeURIComponent(q)}`
      );
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Customers load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!shop?._id) {
      navigate("/shops", { replace: true });
      return;
    }

    load("");
  }, [shop?._id]);

  const addCustomer = async () => {
    setErr("");

    const n = name.trim();
    const p = phone.trim();

    if (!n || !p) {
      setErr("Name aur mobile required");
      return;
    }

    if (!/^\d{10}$/.test(p)) {
      setErr("Mobile 10 digits hona chahiye");
      return;
    }

    setSaving(true);
    try {
      await apiPost("/customers", {
        shopId: shop._id,
        name: n,
        phone: p,
      });

      setName("");
      setPhone("");
      await load("");
    } catch (e) {
      setErr(e.message || "Customer add failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="lg:ml-64 min-h-screen bg-[#f4f7fb]">
      <Container
        title="Customers"
        subtitle={shop?.shopName || "Smart Kirana"}
        right={
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-gray-700 ring-1 ring-black/5">
            {list.length} customers
          </div>
        }
      >
        {/* Hero */}
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 md:p-8 text-white shadow-lg">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="text-sm text-white/70">Customer Management</div>
              <div className="mt-3 text-4xl font-extrabold tracking-tight">
                Manage customers smarter
              </div>
              <div className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Add customers, check balances, open history and directly access
                khata from one clean place.
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-xs uppercase tracking-wide text-white/60">
                Total Linked Customers
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Users className="h-8 w-8 text-white/80" />
                <div className="text-5xl font-extrabold">{list.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Search */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-bold text-gray-900">Search Customer</div>
            <div className="mt-2 text-sm text-gray-500">
              Name ya mobile number se customer search karo.
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="Search name / mobile"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={() => load(search)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </div>

          {/* Add customer */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-bold text-gray-900">Add Customer</div>
            <div className="mt-2 text-sm text-gray-500">
              Naya customer add karke uska account aur khata manage karo.
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <User className="h-5 w-5 text-gray-400" />
                <input
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="Customer name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <Phone className="h-5 w-5 text-gray-400" />
                <input
                  className="w-full bg-transparent text-base outline-none"
                  placeholder="Mobile number"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                />
              </div>

              <button
                onClick={addCustomer}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />
                {saving ? "Saving..." : "Save Customer"}
              </button>
            </div>
          </div>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {/* List */}
        <div className="mt-8">
          <div className="mb-4 text-2xl font-bold tracking-tight text-gray-900">
            Customer List
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && list.length === 0 ? (
            <div className="rounded-3xl bg-white p-5 text-gray-500 shadow-sm ring-1 ring-black/5">
              No customers found.
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {list.map((customer) => (
              <CustomerCard key={customer._id} customer={customer} />
            ))}
          </div>
        </div>
      </Container>

      <BottomNav />
    </div>
  );
}