import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Store, ArrowRight } from "lucide-react";

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

  const onSubmit = async (e) => {
    e.preventDefault();
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
        throw new Error(await parseError(res));
      }

      setMsg("Admin account created successfully");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1000);
    } catch (error) {
      setErr(error.message || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-2">
          <div className="hidden bg-[#0f172a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                <Store className="h-4 w-4" />
                Smart Kirana
              </div>

              <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight">
                Create admin
                <span className="block text-white/65">start your setup</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
                Apna admin account banao aur Smart Kirana dashboard use karna start karo.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white/70">Quick setup</div>
              <div className="mt-2 text-2xl font-black">Minimal • Clean • Ready</div>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            <div className="mx-auto max-w-md">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-gray-500">
                Setup
              </div>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
                Create account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Bas basic details fill karo
              </p>

              <form onSubmit={onSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Name
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
                    <User className="h-5 w-5 text-gray-400" />
                    <input
                      placeholder="Admin name"
                      className="w-full bg-transparent text-base outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-black focus-within:bg-white">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full bg-transparent text-base outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f172a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-black disabled:opacity-60"
                >
                  {loading ? "Creating..." : "Create Admin"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </form>

              <div className="mt-6 space-y-3 text-center">
                <Link
                  to="/admin/login"
                  className="block text-sm font-semibold text-gray-600 underline underline-offset-4"
                >
                  Already have admin? Login
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