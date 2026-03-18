import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          <ShieldCheck className="h-4 w-4" />
          Admin Login
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Admin account se login karke continue karo.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Mail className="h-5 w-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
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
            {loading ? "Logging in..." : "Login as Admin"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </div>
    </div>
  );
}