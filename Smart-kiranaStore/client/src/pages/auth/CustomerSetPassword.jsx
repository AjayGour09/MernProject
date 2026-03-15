import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Smartphone, Lock, KeyRound, ArrowRight } from "lucide-react";
import { AuthService } from "../../services/auth";

export default function CustomerSetPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setErr("Sab fields required");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      setErr("Mobile 10 digits hona chahiye");
      return;
    }

    if (password.trim().length < 4) {
      setErr("Password kam se kam 4 characters ka ho");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords match nahi kar rahe");
      return;
    }

    setLoading(true);
    try {
      await AuthService.customerSetPassword({
        phone: phone.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      setMsg("Password set ho gaya");

      setTimeout(() => {
        navigate("/customer/login");
      }, 1000);
    } catch (e) {
      setErr(e.message || "Failed");
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
                <KeyRound className="h-4 w-4" />
                First time setup
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                Set password
                <span className="block text-white/65">quick setup</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                Pehli baar login karne se pehle apna password set karo.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/70">Simple flow</div>
              <div className="mt-2 text-2xl font-black">Secure • Easy • Clean</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Customer setup
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                Create password
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Apne mobile number ke saath password set karo
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
                    New password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Create password"
                      className="w-full bg-transparent text-base outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Confirm password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      className="w-full bg-transparent text-base outline-none"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {err ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}

                {msg ? (
                  <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
                    {msg}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111827] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Set Password"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <Link
                  to="/customer/login"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Back to login
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