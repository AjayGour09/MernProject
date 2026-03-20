import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  UserCircle2,
  ArrowRight,
  Store,
  LogIn,
  UserPlus,
} from "lucide-react";

function ModeButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
        active ? "bg-white text-black shadow-sm" : "text-gray-500"
      }`}
    >
      {children}
    </button>
  );
}

function RoleCard({ title, text, to, icon, dark = false, mode }) {
  return (
    <Link
      to={to}
      className={`rounded-[30px] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
        dark
          ? "bg-black text-white"
          : "border border-black/5 bg-white text-gray-900"
      }`}
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          dark ? "bg-white/10 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {icon}
      </div>

      <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{title}</h3>

      <p
        className={`mt-3 text-sm leading-7 ${
          dark ? "text-white/75" : "text-gray-500"
        }`}
      >
        {text}
      </p>

      <div
        className={`mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold ${
          dark ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        {mode === "login" ? "Continue to Login" : "Continue to Register"}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

export default function AuthGateway() {
  const [mode, setMode] = useState("login");

  const adminTo = mode === "login" ? "/admin/login" : "/admin/setup";
  const customerTo =
    mode === "login" ? "/customer/login" : "/customer/set-password";

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
          <div className="rounded-[36px] bg-gradient-to-br from-black via-gray-900 to-gray-800 p-6 text-white shadow-lg md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
                <Store className="h-5 w-5" />
              </div>

              <div>
                <div className="text-lg font-extrabold tracking-tight">
                  Smart Kirana
                </div>
                <div className="text-xs text-white/60">
                  Choose how to continue
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="text-sm text-white/70">Authentication Gateway</div>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">
                {mode === "login" ? "Login to your account" : "Register your account"}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 md:text-base">
                Admin ya customer role choose karo aur same app ke andar proper
                structured flow ke saath continue karo.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-4">
                <div className="text-sm font-bold text-white">
                  Admin Flow
                </div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  Shops, stock, customers, khata and sales manage karo.
                </div>
              </div>

              <div className="rounded-3xl bg-white/10 p-4">
                <div className="text-sm font-bold text-white">
                  Customer Flow
                </div>
                <div className="mt-2 text-sm leading-6 text-white/70">
                  Linked shops, balance aur transaction history check karo.
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[36px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Continue
              </div>

              <h2 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
                {mode === "login" ? "Login" : "Register"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                {mode === "login"
                  ? "Agar account hai to login karo."
                  : "Agar account nahi hai to register karo."}
              </p>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex rounded-2xl bg-gray-100 p-1">
                <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
                  <span className="inline-flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </span>
                </ModeButton>

                <ModeButton
                  active={mode === "register"}
                  onClick={() => setMode("register")}
                >
                  <span className="inline-flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Register
                  </span>
                </ModeButton>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <RoleCard
                dark
                to={adminTo}
                icon={<ShieldCheck className="h-5 w-5" />}
                title={`Admin ${mode === "login" ? "Login" : "Register"}`}
                text={
                  mode === "login"
                    ? "Dashboard access karke shops aur business operations manage karo."
                    : "Naya admin account create karke Smart Kirana use karna start karo."
                }
                mode={mode}
              />

              <RoleCard
                to={customerTo}
                icon={<UserCircle2 className="h-5 w-5" />}
                title={`Customer ${mode === "login" ? "Login" : "Register"}`}
                text={
                  mode === "login"
                    ? "Apna account, linked shops aur khata history check karo."
                    : "Agar admin ne add kiya hai to password set karke account activate karo."
                }
                mode={mode}
              />
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="text-sm font-semibold text-gray-600 underline underline-offset-4"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}