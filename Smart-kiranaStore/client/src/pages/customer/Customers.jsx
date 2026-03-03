import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/Container";
import BottomNav from "../../components/BottomNav";
import { apiGet, apiPost } from "../../services/api";
import { QRCodeCanvas } from "qrcode.react";

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/10">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-extrabold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold"
          >
            ✖
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function formatMoney(v) {
  const n = Number(v || 0);
  return `₹${Number.isFinite(n) ? n : 0}`;
}

export default function Customers() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ✅ QR modal state
  const [qrOpen, setQrOpen] = useState(false);
  const [qrCustomer, setQrCustomer] = useState(null);

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

      const amount = Number(customer.balance || 0);
      if (!Number.isFinite(amount) || amount <= 0) return alert("No pending amount");

      const cname = customer.name || "Customer";
      const phone10 = String(customer.phone).replace(/\D/g, "").slice(-10);
      if (phone10.length !== 10) return alert("Invalid phone number");

      const msg = `Namaste ${cname} ji,\n\nAapka ${formatMoney(amount)} baki hai.\nKripya payment kar dein.\n\n- Smart Kirana`;
      const url = `https://wa.me/91${phone10}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank");
    } catch {
      alert("Something went wrong");
    }
  };

  // ✅ open QR popup
  const openQR = (customer) => {
    setQrCustomer(customer);
    setQrOpen(true);
  };

  const qrLink = useMemo(() => {
    if (!qrCustomer?._id) return "";
    // ✅ local + deployed auto support
    return `${window.location.origin}/customers/${qrCustomer._id}`;
  }, [qrCustomer]);

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
            const baki = Number(c.balance || 0);
            const hasBaki = baki > 0;

            return (
              <div key={c._id} className="rounded-2xl bg-white p-4 shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-lg font-bold truncate">{c.name}</div>
                    <div className="text-sm text-gray-600">{c.phone}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">Baki</div>
                    <div className="text-lg font-extrabold">
                      {formatMoney(baki)}
                    </div>
                  </div>
                </div>

                {/* ✅ Actions: History + QR + WhatsApp */}
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <Link
                    to={`/customers/${c._id}`}
                    className="rounded-2xl border py-3 text-center font-semibold active:scale-[0.99]"
                  >
                    🧾 History
                  </Link>

                  <button
                    onClick={() => openQR(c)}
                    className="rounded-2xl border py-3 text-center font-semibold active:scale-[0.99]"
                  >
                    🔳 QR
                  </button>

                  {hasBaki ? (
                    <button
                      onClick={() => sendReminder(c)}
                      className="rounded-2xl bg-green-600 py-3 font-semibold text-white active:scale-[0.99]"
                    >
                      📲 WhatsApp
                    </button>
                  ) : (
                    <div className="rounded-2xl border bg-gray-50 py-3 text-center text-sm font-semibold text-gray-600">
                      ✅ Clear
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  QR scan → customer details open.
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

      {/* ✅ QR Modal */}
      <Modal
        open={qrOpen}
        onClose={() => {
          setQrOpen(false);
          setQrCustomer(null);
        }}
        title={`QR: ${qrCustomer?.name || ""}`}
      >
        <div className="flex flex-col items-center">
          <div className="rounded-2xl border bg-white p-3">
            <QRCodeCanvas value={qrLink || " "} size={220} includeMargin />
          </div>

          <div className="mt-3 w-full rounded-2xl border bg-gray-50 p-3 text-xs text-gray-700 break-all">
            {qrLink}
          </div>

          <button
            onClick={() => {
              if (!qrLink) return;
              navigator.clipboard?.writeText(qrLink);
              alert("Link copied ✅");
            }}
            className="mt-3 w-full rounded-2xl bg-black py-3 font-semibold text-white active:scale-[0.99]"
          >
            📋 Copy Link
          </button>

          <div className="mt-2 text-xs text-gray-500 text-center">
            Scan karo → customer page open ho jayega.
          </div>
        </div>
      </Modal>

      <BottomNav />
    </>
  );
}