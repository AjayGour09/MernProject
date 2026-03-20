import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthService } from "../../services/auth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email.trim() || !password.trim()) {
      setErr("Email aur password required");
      return;
    }

    setLoading(true);
    try {
      await AuthService.adminLogin({
        email: email.trim(),
        password: password.trim(),
      });

      navigate("/shops", { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[36px] bg-white shadow-sm ring-1 ring-black/5 xl:grid-cols-[1fr_1fr]">
          <div className="hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 p-10 text-white xl:flex xl:flex-col xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold">
                <ShieldCheck className="h-4 w-4" />
                Admin Access
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
                Login to manage
                <span className="block text-white/70">your business</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Shops, customers, stock, khata aur sales ek modern dashboard se
                control karo.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm font-semibold text-white/70">
                Smart Kirana
              </div>
              <div className="mt-2 text-2xl font-extrabold">
                Clean • Secure • Professional
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 xl:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Admin Login
              </div>

              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Admin account se login karke apni shops aur dashboard access karo.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full bg-transparent text-base outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      className="w-full bg-transparent text-base outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {err ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login as Admin"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-8 rounded-3xl bg-gray-50 p-4 ring-1 ring-black/5">
                <div className="text-sm font-semibold text-gray-900">
                  New admin?
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Agar account nahi hai to pehle register karo.
                </div>

                <Link
                  to="/admin/setup"
                  className="mt-4 inline-flex rounded-2xl bg-black px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
                >
                  Create Admin Account
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/auth-gateway"
                  className="text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}