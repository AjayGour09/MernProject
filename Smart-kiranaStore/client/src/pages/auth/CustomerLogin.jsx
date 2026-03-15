import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Smartphone, Lock, ArrowRight, UserCircle2 } from "lucide-react";
import { AuthService } from "../../services/auth";

export default function CustomerLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!phone.trim() || !password.trim()) {
      setErr("Mobile aur password required");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setErr("Mobile 10 digits hona chahiye");
      return;
    }

    setLoading(true);
    try {
      await AuthService.customerLogin({
        phone: phone.trim(),
        password: password.trim(),
      });

      navigate("/my-shops", { replace: true });
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
          <div className="hidden bg-[#111827] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <UserCircle2 className="h-4 w-4" />
                Customer access
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                Customer login
                <span className="block text-white/65">simple and clear</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                Apna linked shops, balance aur history check karne ke liye login karo.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/70">Customer panel</div>
              <div className="mt-2 text-2xl font-black">Easy • Neat • Smooth</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Customer
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                Login
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Apne account me continue karo
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mobile number
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <input
                      placeholder="Enter mobile"
                      inputMode="numeric"
                      className="w-full bg-transparent text-base outline-none"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login as Customer"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <Link
                  to="/customer/set-password"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  First time? Set password
                </Link>

                <Link
                  to="/admin/login"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Admin login
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