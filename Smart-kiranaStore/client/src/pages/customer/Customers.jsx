import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet, apiPost } from "../../services/api";

function formatBalance(balance) {
  const b = Number(balance || 0);
  if (b > 0) return { label: "Baki", value: `₹${b}`, cls: "text-red-700" };
  if (b < 0) return { label: "Advance", value: `₹${Math.abs(b)}`, cls: "text-green-700" };
  return { label: "Status", value: "Clear", cls: "text-gray-700" };
}

export default function Customers() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = async (q = search) => {
    setLoading(true);
    setErr("");
    try {
      const data = await apiGet(`/customers?search=${encodeURIComponent(q)}`);
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("");
    // eslint-disable-next-line
  }, []);

  const addCustomer = async () => {
    setErr("");
    const n = name.trim();
    const p = phone.trim();

    if (!n || !p) return setErr("Name & mobile required");
    if (!/^\d{10}$/.test(p)) return setErr("Mobile 10 digits hona chahiye");

    try {
      await apiPost("/customers", { name: n, phone: p });
      setName("");
      setPhone("");
      await load("");
    } catch (e) {
      setErr(e.message || "Failed to add");
    }
  };

  const sendReminder = (customer) => {
    try {
      if (!customer?.phone) return alert("Phone number missing");

      const bal = Number(customer.balance || 0);
      const cname = customer.name || "Customer";
      const phone10 = String(customer.phone).replace(/\D/g, "").slice(-10);
      if (phone10.length !== 10) return alert("Invalid phone number");

      let msg = "";
      if (bal > 0) {
        msg = `Namaste ${cname} ji,\n\nAapka ₹${bal} baki hai.\nKripya payment kar dein.\n\n- Smart Kirana`;
      } else if (bal < 0) {
        msg = `Namaste ${cname} ji,\n\nAapke account me ₹${Math.abs(
          bal
        )} advance jama hai.\nAgli kharidari me adjust ho jayega.\n\n- Smart Kirana`;
      } else {
        msg = `Namaste ${cname} ji,\n\nAapka account clear hai.\n\n- Smart Kirana`;
      }

      const url = `https://wa.me/91${phone10}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Container
        title="Customers"
        right={<span className="text-sm text-gray-500">{list.length}</span>}
      >
        <div className="rounded-2xl bg-white p-4 shadow">
          <div className="space-y-3">
            <input
              className="w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Search name / mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => load(search)}
              className="w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
            >
              🔍 Search
            </button>
          </div>

          <div className="mt-4 rounded-2xl border p-4">
            <div className="text-base font-bold">➕ Add Customer</div>

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Name (Ajay)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
              placeholder="Mobile (10 digit)"
              inputMode="numeric"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />

            <button
              onClick={addCustomer}
              className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
            >
              ✅ Save
            </button>

            {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {loading ? <p className="text-gray-600">Loading...</p> : null}

          {list.map((c) => {
            const balanceUI = formatBalance(c.balance);

            return (
              <div key={c._id} className="rounded-2xl bg-white p-4 shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-bold truncate">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.phone}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">{balanceUI.label}</div>
                    <div className={`text-lg font-extrabold ${balanceUI.cls}`}>
                      {balanceUI.value}
                    </div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Link
                    to={`/customers/${c._id}`}
                    className="rounded-2xl border py-3 text-center font-semibold active:scale-[0.99]"
                  >
                    🧾 History
                  </Link>

                  <button
                    onClick={() => sendReminder(c)}
                    className="rounded-2xl bg-green-600 py-3 font-semibold text-white active:scale-[0.99]"
                  >
                    📲 WhatsApp
                  </button>

                  <Link
                    to={`/khata?customerId=${c._id}`}
                    className="rounded-2xl border py-3 text-center font-semibold active:scale-[0.99]"
                  >
                    📒 Khata
                  </Link>
                </div>
              </div>
            );
          })}

          {!loading && list.length === 0 ? (
            <div className="rounded-2xl bg-white p-4 text-gray-600 shadow">
              No customers yet.
            </div>
          ) : null}
        </div>
      </Container>

      <BottomNav />
    </>
  );
}