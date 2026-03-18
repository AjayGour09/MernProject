import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Smartphone, Lock, ArrowRight } from "lucide-react";
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
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
          <Smartphone className="h-4 w-4" />
          Customer Login
        </div>

        <h1 className="mt-5 text-4xl font-black tracking-tight text-gray-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Customer account se login karke continue karo.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Smartphone className="h-5 w-5 text-gray-400" />
            <input
              placeholder="Mobile number"
              inputMode="numeric"
              className="w-full bg-transparent outline-none"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
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
            {loading ? "Logging in..." : "Login as Customer"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>
      </div>
    </div>
  );
}