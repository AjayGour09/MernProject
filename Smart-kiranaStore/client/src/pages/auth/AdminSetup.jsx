import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AuthService } from "../../services/auth";

export default function AdminSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErr("Sab fields required hain");
      return;
    }

    setLoading(true);

    try {
      await AuthService.adminRegister({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      navigate("/admin/login", { replace: true });
    } catch (e) {
      setErr(e.message || "Admin setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[36px] border border-black/5 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Admin Setup
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight tracking-tight">
                Create secure
                <span className="block text-white/65">admin access</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Smart Kirana ka admin account create karke apna business control
                dashboard activate karo.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                  <Sparkles className="h-4 w-4" />
                  One-time setup
                </div>

                <div className="mt-2 text-sm text-white/65">
                  Ek baar account banao, fir shops aur operations manage karo.
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/70">
                Secure Start
              </div>
              <div className="mt-2 text-2xl font-black">
                Fast • Protected • Reliable
              </div>
            </div>
          </div>

          <div className="flex items-center p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-500">
                Admin setup
              </div>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
                Create account
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Admin details fill karke first account create karo.
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5">
                  <User className="h-5 w-5 text-gray-400" />
                  <input
                    placeholder="Full name"
                    className="w-full bg-transparent outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {err ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-bold text-white"
                >
                  {loading ? "Creating..." : "Create Admin"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  to="/admin/login"
                  className="text-sm font-semibold text-gray-600 underline"
                >
                  Already have admin account?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}