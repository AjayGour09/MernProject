import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, UserCircle2, ArrowRight, Store } from "lucide-react";

function RoleCard({ title, text, to, icon, dark = false }) {
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

      <h3 className="mt-5 text-2xl font-black tracking-tight">{title}</h3>

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
        Continue
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
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[36px] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.10)] ring-1 ring-black/5 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                Smart Kirana
              </div>
              <div className="text-xs text-gray-500">Choose how to continue</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
              Continue
            </div>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">
              {mode === "login" ? "Login" : "Register"}
            </h1>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              {mode === "login"
                ? "Agar account hai to login karo."
                : "Agar account nahi hai to register karo."}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-2xl bg-gray-100 p-1">
              <button
                onClick={() => setMode("login")}
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  mode === "login"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Login
              </button>

              <button
                onClick={() => setMode("register")}
                className={`rounded-2xl px-5 py-3 text-sm font-bold transition ${
                  mode === "register"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <RoleCard
              dark
              to={adminTo}
              icon={<ShieldCheck className="h-5 w-5" />}
              title={`Admin ${mode === "login" ? "Login" : "Register"}`}
              text={
                mode === "login"
                  ? "Admin dashboard access karke shops aur business manage karo."
                  : "Naya admin account create karke Smart Kirana start karo."
              }
            />

            <RoleCard
              to={customerTo}
              icon={<UserCircle2 className="h-5 w-5" />}
              title={`Customer ${mode === "login" ? "Login" : "Register"}`}
              text={
                mode === "login"
                  ? "Customer account, linked shops aur khata history check karo."
                  : "Agar admin ne add kiya hai to password set karke account activate karo."
              }
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
  );
}