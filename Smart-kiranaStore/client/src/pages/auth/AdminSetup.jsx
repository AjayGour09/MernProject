import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

async function parseError(res) {
  try {
    const data = await res.json();
    return data?.message || "Request failed";
  } catch {
    try {
      return await res.text();
    } catch {
      return "Request failed";
    }
  }
}

export default function AdminSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");
    setMsg("");

    if (!email.trim() || !password.trim()) {
      setErr("Email aur password required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/setup-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || "Admin",
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!res.ok) {
        const message = await parseError(res);
        throw new Error(message);
      }

      setMsg("Admin account created ✅ Ab login karo");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1200);
    } catch (error) {
      setErr(error.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
        <div className="mt-1 text-3xl font-extrabold text-gray-900">
          Admin Setup
        </div>

        <input
          className="mt-5 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <input
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <input
          type="password"
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-black py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Admin"}
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
          to="/admin/login"
          className="mt-4 block text-center text-sm font-semibold text-gray-600 underline"
        >
          Already have admin? Login
        </Link>
      </div>
    </div>
  );
}