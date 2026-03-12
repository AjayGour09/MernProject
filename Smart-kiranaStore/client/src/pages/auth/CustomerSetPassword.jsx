import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../services/auth";

export default function CustomerSetPassword() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");
    setMsg("");

    if (!phone.trim() || !password.trim() || !confirmPassword.trim()) {
      return setErr("Sab fields required");
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return setErr("Mobile 10 digits hona chahiye");
    }

    if (password.trim().length < 4) {
      return setErr("Password kam se kam 4 characters ka ho");
    }

    if (password !== confirmPassword) {
      return setErr("Passwords match nahi kar rahe");
    }

    setLoading(true);
    try {
      await AuthService.customerSetPassword({
        phone: phone.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      setMsg("Password set ho gaya ✅ Ab login karo");

      setTimeout(() => {
        navigate("/customer/login");
      }, 1200);
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
        <div className="mt-1 text-3xl font-extrabold text-gray-900">
          Set Password
        </div>
        <div className="mt-1 text-sm text-gray-500">
          Pehli baar login ke liye password banao
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
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-black py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Set Password"}
        </button>

        {err ? (
          <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {msg ? (
          <div className="mt-3 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {msg}
          </div>
        ) : null}

        <Link
          to="/customer/login"
          className="mt-4 block text-center text-sm font-semibold text-gray-600 underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}