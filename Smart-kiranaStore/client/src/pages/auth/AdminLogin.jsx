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
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          <div className="hidden bg-[#0f172a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Smart Kirana
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                Admin login
                <span className="block text-white/65">clean and secure</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                Shop, customers, khata, stock aur sales sab kuch ek hi dashboard se manage karo.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/70">Admin access</div>
              <div className="mt-2 text-2xl font-black">Fast • Simple • Professional</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Admin panel
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Apne admin account se login karo
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
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
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login as Admin"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <Link
                  to="/admin/setup"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Create admin account
                </Link>

                <Link
                  to="/customer/login"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Customer login
                </Link>

                <Link
                  to="/"
                  className="block text-sm font-semibold text-gray-500 underline underline-offset-4"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}