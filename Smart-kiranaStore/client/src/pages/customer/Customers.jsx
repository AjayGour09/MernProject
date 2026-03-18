import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <>
      <Container
        title="Customers"
        subtitle={shop?.shopName || "Smart Kirana"}
        right={
          <div className="rounded-2xl bg-white px-3 py-2 text-sm font-bold text-gray-700 ring-1 ring-black/5">
            {list.length}
          </div>
        }
      >
        <div className="rounded-[30px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white shadow-lg">
          <div className="text-sm font-medium text-white/70">Customer Overview</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">
            {list.length}
          </div>
          <div className="mt-2 text-sm text-white/70">
            Total linked customers in this shop
          </div>

          <div className="mt-4">
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder:text-white/55 outline-none"
              placeholder="Search name / mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => load(search)}
              className="mt-3 w-full rounded-2xl bg-white py-3 text-sm font-bold text-black transition hover:bg-gray-100"
            >
              Search Customer
            </button>
          </div>
        </div>

        <div className="rounded-[30px] bg-white p-4 shadow-sm ring-1 ring-black/5">
          <div className="text-base font-bold text-gray-900">Add New Customer</div>
          <div className="mt-1 text-sm text-gray-500">
            Naya customer add karke uska khata aur history manage karo.
          </div>

          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Customer name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Mobile number"
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />

            <button
              onClick={addCustomer}
              disabled={saving}
              className="w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>

          {err ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}
        </div>

        <div>
          <div className="mb-3 text-base font-bold text-gray-900">
            Customer List
          </div>

          {loading ? <p className="text-sm text-gray-500">Loading...</p> : null}

          {!loading && list.length === 0 ? (
            <div className="rounded-[28px] bg-white p-4 text-gray-500 shadow-sm ring-1 ring-black/5">
              No customers found.
            </div>
          ) : null}

          <div className="space-y-4">
            {list.map((c) => {
              const balanceUI = formatBalance(c.balance);

              return (
                <div
                  key={c._id}
                  className="rounded-[28px] bg-white p-4 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xl font-extrabold tracking-tight text-gray-900">
                        {c.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">{c.phone}</div>

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
                      to={`/customers/${c._id}`}
                      className="rounded-2xl border py-3 text-center text-sm font-bold text-gray-900 transition hover:bg-gray-50"
                    >
                      View History
                    </Link>

                    <Link
                      to={`/khata?customerId=${c._id}`}
                      className="rounded-2xl bg-black py-3 text-center text-sm font-bold text-white transition hover:bg-gray-900"
                    >
                      Open Khata
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      <BottomNav />
    </>
  );
}