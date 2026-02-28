import { useEffect, useState } from "react";
import Container from "../../components/Container.jsx";
import BottomNav from "../../components/BottomNav.jsx";
import { apiGet, apiPost } from "../../services/api.js";

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
      setList(data);
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

    if (!n || !p) {
      setErr("Name & mobile required");
      return;
    }
    if (!/^\d{10}$/.test(p)) {
      setErr("Mobile 10 digits hona chahiye");
      return;
    }

    try {
      await apiPost("/customers", { name: n, phone: p });
      setName("");
      setPhone("");
      await load("");
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <>
      <Container title="Customers" right={<span className="text-sm text-gray-500">{list.length}</span>}>
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
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

          {list.map((c) => (
            <div key={c._id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-lg font-bold">{c.name}</div>
                  <div className="text-sm text-gray-600">{c.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Baki</div>
                  <div className="text-lg font-extrabold">₹{c.balance || 0}</div>
                </div>
              </div>
            </div>
          ))}

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