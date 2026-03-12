import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../services/auth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");

    if (!email.trim() || !password.trim()) {
      return setErr("Email aur password required");
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
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
        <div className="mt-1 text-3xl font-extrabold text-gray-900">
          Admin Login
        </div>

        <input
          className="mt-5 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Logging in..." : "Login as Admin"}
        </button>

        {err ? (
          <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <Link
          to="/admin/setup"
          className="mt-4 block text-center text-sm font-semibold text-gray-600 underline"
        >
          Create admin account
        </Link>

        <Link
          to="/customer/login"
          className="mt-2 block text-center text-sm font-semibold text-gray-600 underline"
        >
          Customer login
        </Link>
      </div>
    </div>
  );
}