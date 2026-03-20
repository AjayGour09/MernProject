import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Smartphone, Lock, ArrowRight, KeyRound } from "lucide-react";
import { AuthService } from "../../services/auth";

export default function CustomerSetPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      setErr("Sab fields required hain");
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

      navigate("/customer/login", { replace: true });
    } catch (e) {
      setErr(e.message || "Failed");
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
                <KeyRound className="h-4 w-4" />
                Customer Registration
              </div>

              <h1 className="mt-8 text-5xl font-extrabold tracking-tight">
                Set your
                <span className="block text-white/70">customer password</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Agar admin ne aapko add kiya hai to yahan se apna password set
                karke account activate karo.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 p-5">
              <div className="text-sm font-semibold text-white/70">
                Smart Kirana
              </div>
              <div className="mt-2 text-2xl font-extrabold">
                Simple • Secure • Easy
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 xl:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Customer Register
              </div>

              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900">
                Set password
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Mobile number ke saath password set karke login ke liye ready ho jao.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                    <input
                      placeholder="Enter mobile number"
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

                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
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
                    Confirm Password
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900 disabled:opacity-60"
                >
                  {loading ? "Saving..." : "Set Password"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/customer/login"
                  className="text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Back to customer login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}