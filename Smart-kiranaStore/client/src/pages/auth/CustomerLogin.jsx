import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../services/auth";

export default function CustomerLogin() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");

    if (!phone.trim() || !password.trim()) {
      return setErr("Mobile aur password required");
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return setErr("Mobile 10 digits hona chahiye");
    }

    setLoading(true);
    try {
      await AuthService.customerLogin({
        phone: phone.trim(),
        password: password.trim(),
      });

      navigate("/my-account", { replace: true });
    } catch (e) {
      setErr(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
        <div className="mt-1 text-3xl font-extrabold text-gray-900">
          Customer Login
        </div>

        <input
          className="mt-5 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Mobile number"
          inputMode="numeric"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
        />

        <input
          type="password"
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-black py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login as Customer"}
        </button>

        {err ? (
          <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <Link
          to="/customer/set-password"
          className="mt-4 block text-center text-sm font-semibold text-gray-600 underline"
        >
          First time? Set password
        </Link>

        <Link
          to="/admin/login"
          className="mt-2 block text-center text-sm font-semibold text-gray-600 underline"
        >
          Admin login
        </Link>
      </div>
    </div>
  );
}