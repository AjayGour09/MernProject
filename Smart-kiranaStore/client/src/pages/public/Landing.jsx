import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Receipt,
  Boxes,
  Users,
} from "lucide-react";

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleOutside(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEsc(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative z-[220]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <span>{label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+10px)] z-[250] w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg transition-all duration-200 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            onClick={() => setOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <span>{item.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}

function PreviewCard() {
  return (
    <div className="rounded-3xl bg-white p-5 text-slate-900 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Shop Overview
          </p>
          <h3 className="mt-1 text-lg font-bold">Today’s Summary</h3>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Live
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Sales</p>
          <p className="mt-1 text-2xl font-bold">₹12,480</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Pending Khata</p>
          <p className="mt-1 text-2xl font-bold">₹4,250</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <p className="text-xs text-slate-500">Low Stock Items</p>
          <p className="mt-1 text-2xl font-bold">07</p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative z-[200] rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <Store className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Smart Kirana
                </h1>
                <p className="text-xs text-slate-500">
                  Simple store management system
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Dropdown
                label="Login"
                items={[
                  { label: "Admin Login", to: "/admin/login" },
                  { label: "Customer Login", to: "/customer/login" },
                ]}
              />

              <Dropdown
                label="Register"
                items={[
                  { label: "Admin Register", to: "/admin/setup" },
                  { label: "Customer Register", to: "/customer/set-password" },
                ]}
              />
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 rounded-3xl bg-emerald-500 px-6 py-8 text-white shadow-sm sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-10 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Smart and easy workflow
            </div>

            <h2 className="mt-5 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
              Manage your kirana store with ease
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/90 sm:text-base">
              Handle billing, stock, khata and customer records in one simple
              and reliable system for daily shop operations.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/admin/login"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-slate-100"
              >
                Admin Login
              </Link>

              <Link
                to="/customer/login"
                className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Customer Login
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                Billing
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                Stock
              </span>
              <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                Khata
              </span>
            </div>
          </div>

          <div>
            <PreviewCard />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <p className="text-sm font-semibold text-emerald-600">
              Why Smart Kirana
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">
              Everything you need for daily store management
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<Receipt className="h-5 w-5" />}
              title="Billing"
              text="Keep daily sales and purchase entries organized in one place."
            />

            <FeatureCard
              icon={<Boxes className="h-5 w-5" />}
              title="Stock"
              text="Track available items and avoid confusion in your inventory."
            />

            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Customers"
              text="Manage customer records, khata details and payment history."
            />
          </div>
        </section>
      </div>
    </div>
  );
}