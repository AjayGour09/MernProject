import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, User, Mail, Lock, ArrowRight } from "lucide-react";
import { AuthService } from "../../services/auth";

export default function AdminSetup() {
  const navigate = useNavigate();

  const [name, setName] = useState("Admin");
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
      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-bold text-white">
            <ShieldCheck className="h-4 w-4" />
            Admin Register
          </div>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900">
            Create account
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Admin account create karke Smart Kirana start karo.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
                <User className="h-5 w-5 text-gray-400" />
                <input
                  placeholder="Enter name"
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

              <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5">
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
              {loading ? "Creating..." : "Create Admin Account"}
              {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm font-semibold text-gray-600 underline underline-offset-4"
            >
              Already have admin account?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}