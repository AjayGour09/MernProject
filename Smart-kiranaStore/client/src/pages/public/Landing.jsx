import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Store,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  User2,
  Sparkles,
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
    <div ref={wrapRef} className="relative z-[60]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`absolute right-0 top-[calc(100%+12px)] z-[70] w-60 rounded-3xl border border-white/10 bg-[#12141b]/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all duration-200 ${
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
            className="flex items-center justify-between rounded-2xl px-4 py-3 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white"
          >
            <span>{item.label}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function AuthOption({ to, title, sub, icon }) {
  return (
    <Link
      to={to}
      className="group rounded-[24px] border border-white/10 bg-white/[0.05] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
            {icon}
          </div>

          <h3 className="mt-4 text-lg font-extrabold tracking-tight text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-white/58">{sub}</p>
        </div>

        <div className="rounded-full bg-white/10 p-2 transition-transform duration-300 group-hover:translate-x-1">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </Link>
  );
}

function MiniCard({ title, sub }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
      <div className="text-lg font-bold text-white">{title}</div>
      <div className="mt-1 text-sm text-white/55">{sub}</div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_22%)]" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="relative z-50 rounded-[30px] border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-black shadow-lg">
                <Store className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="truncate text-xl font-black tracking-tight">
                  Smart Kirana
                </div>
                <div className="truncate text-xs text-white/45">
                  Production-ready kirana workflow
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

        <section className="relative z-10 mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#11131b] via-[#0b1020] to-[#090b11] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] md:p-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/75">
              <Sparkles className="h-4 w-4" />
              Minimal, premium and production-ready
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl xl:text-6xl">
              Smart kirana system
              <span className="block text-white/40">for admin and customer</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/58 sm:text-base">
              Login, register, manage shop, track khata and access customer
              history in one clean workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Admin Login
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/customer/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                Customer Login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <MiniCard title="Admin" sub="Shop management" />
              <MiniCard title="Customer" sub="Khata and history" />
              <MiniCard title="Simple" sub="Clean access flow" />
            </div>
          </div>

          <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl">
            <div className="mb-5">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white/45">
                Access
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
                Choose your path
              </h2>
              <p className="mt-2 text-sm text-white/55">
                Login ya register karke apna workflow start karo.
              </p>
            </div>

            <div className="grid gap-4">
              <AuthOption
                to="/admin/login"
                title="Admin Login"
                sub="Dashboard, customers, stock and sales access."
                icon={<ShieldCheck className="h-5 w-5" />}
              />

              <AuthOption
                to="/admin/setup"
                title="Admin Register"
                sub="Create a new admin account and start setup."
                icon={<Store className="h-5 w-5" />}
              />

              <AuthOption
                to="/customer/login"
                title="Customer Login"
                sub="Check linked shops, khata and history."
                icon={<User2 className="h-5 w-5" />}
              />

              <AuthOption
                to="/customer/set-password"
                title="Customer Register"
                sub="First-time password setup for customer access."
                icon={<User2 className="h-5 w-5" />}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}