import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthService } from "../../services/auth";

export default function AuthPage() {
  const navigate = useNavigate();
  const { mode, role } = useParams();

  const isLogin = mode === "login";
  const isAdmin = role === "admin";

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setErr("");

    if (!isLogin && !name.trim()) {
      return setErr("Name required");
    }

    if (!emailOrPhone.trim() || !password.trim()) {
      return setErr(
        isAdmin ? "Email aur password required" : "Mobile aur password required"
      );
    }

    if (!isAdmin && !/^\d{10}$/.test(emailOrPhone.trim())) {
      return setErr("Mobile 10 digits hona chahiye");
    }

    if (!isLogin) {
      if (!confirmPassword.trim()) {
        return setErr("Confirm password required");
      }
      if (password !== confirmPassword) {
        return setErr("Passwords match nahi kar rahe");
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        if (isAdmin) {
          await AuthService.adminLogin({
            email: emailOrPhone.trim(),
            password: password.trim(),
          });

          // ✅ admin real dashboard
          navigate("/dashboard", { replace: true });
        } else {
          await AuthService.customerLogin({
            phone: emailOrPhone.trim(),
            password: password.trim(),
          });

          // ✅ customer real page
          navigate("/my-account", { replace: true });
        }
      } else {
        if (isAdmin) {
          await AuthService.adminRegister({
            name: name.trim(),
            email: emailOrPhone.trim(),
            password: password.trim(),
          });

          navigate("/auth/login/admin", { replace: true });
        } else {
          await AuthService.customerRegister({
            name: name.trim(),
            phone: emailOrPhone.trim(),
            password: password.trim(),
          });

          navigate("/auth/login/customer", { replace: true });
        }
      }
    } catch (e) {
      setErr(e.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8">
      <div className="mx-auto max-w-md rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>

        <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
          {isAdmin ? "Admin" : "Customer"} {isLogin ? "Login" : "Register"}
        </div>

        <div className="mt-2 text-sm text-gray-500">
          {isLogin
            ? `${isAdmin ? "Admin" : "Customer"} account me login karo`
            : `${isAdmin ? "Admin" : "Customer"} account banao`}
        </div>

        {!isLogin ? (
          <input
            className="mt-6 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}

        <input
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder={isAdmin ? "Email" : "Mobile number"}
          value={emailOrPhone}
          onChange={(e) =>
            isAdmin
              ? setEmailOrPhone(e.target.value)
              : setEmailOrPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
        />

        <input
          type="password"
          className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {!isLogin ? (
          <input
            type="password"
            className="mt-3 w-full rounded-2xl border px-4 py-3 text-base outline-none focus:ring-2 focus:ring-black"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        ) : null}

        <button
          onClick={onSubmit}
          disabled={loading}
          className="mt-5 w-full rounded-2xl bg-black py-3 font-bold text-white disabled:opacity-60"
        >
          {loading
            ? isLogin
              ? "Logging in..."
              : "Creating..."
            : isLogin
            ? "Continue"
            : "Create Account"}
        </button>

        {err ? (
          <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <div className="mt-5 text-center text-sm text-gray-500">
          {isLogin ? "Need account?" : "Already have account?"}{" "}
          <Link
            to={isLogin ? `/auth/register/${role}` : `/auth/login/${role}`}
            className="font-semibold text-gray-700 underline"
          >
            {isLogin ? "Register" : "Login"}
          </Link>
        </div>

        <Link
          to={`/choose/${mode}`}
          className="mt-3 block text-center text-sm font-semibold text-gray-600 underline"
        >
          ← Change role
        </Link>

        <Link
          to="/"
          className="mt-2 block text-center text-sm font-semibold text-gray-600 underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}