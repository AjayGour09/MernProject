import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Smartphone,
  Lock,
  ArrowRight,
  KeyRound,
} from "lucide-react";
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

    if (!phone || !password || !confirmPassword) {
      setErr("Sab fields required hain");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords match nahi kar rahe");
      return;
    }

    setLoading(true);

    try {
      await AuthService.customerSetPassword({
        phone,
        password,
        confirmPassword,
      });

      navigate("/customer/login", { replace: true });
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-md rounded-[36px] bg-white p-8 shadow-[0_25px_80px_rgba(15,23,42,0.10)]">
        <div className="rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-5 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
            <KeyRound className="h-4 w-4" />
            Customer Password
          </div>

          <h1 className="mt-5 text-3xl font-black tracking-tight">
            Set password
          </h1>

          <p className="mt-2 text-sm text-white/70">
            Mobile number ke saath apna password create karo.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5">
            <Smartphone className="h-5 w-5 text-gray-400" />
            <input
              placeholder="Mobile number"
              className="w-full bg-transparent outline-none"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
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

          <div className="flex items-center gap-3 rounded-2xl border bg-gray-50 px-4 py-3.5">
            <Lock className="h-5 w-5 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-transparent outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Saving..." : "Set Password"}
            {!loading ? <ArrowRight className="h-4 w-4" /> : null}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/customer/login"
            className="text-sm font-semibold text-gray-600 underline"
          >
            Back to customer login
          </Link>
        </div>
      </div>
    </div>
  );
}