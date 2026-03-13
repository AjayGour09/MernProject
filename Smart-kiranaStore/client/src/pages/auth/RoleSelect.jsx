import { Link, useParams } from "react-router-dom";

function RoleCard({ to, title, desc, icon, dark = false }) {
  return (
    <Link
      to={to}
      className={`rounded-3xl p-5 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 ${
        dark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${
            dark ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>

        <div>
          <div className="text-lg font-extrabold">{title}</div>
          <div className={`mt-2 text-sm leading-6 ${dark ? "text-white/75" : "text-gray-500"}`}>
            {desc}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function RoleSelect() {
  const { mode } = useParams();
  const isLogin = mode === "login";

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8">
      <div className="mx-auto max-w-md space-y-5">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-sm font-semibold text-gray-500">Smart Kirana</div>
          <div className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
            {isLogin ? "Login as" : "Register as"}
          </div>
          <div className="mt-2 text-sm text-gray-500">Apna role choose karo</div>
        </div>

        <div className="grid gap-4">
          <RoleCard
            to={`/auth/${mode}/admin`}
            title={`Admin ${isLogin ? "Login" : "Register"}`}
            desc="Shop owner dashboard ke liye"
            icon="🏪"
            dark
          />
          <RoleCard
            to={`/auth/${mode}/customer`}
            title={`Customer ${isLogin ? "Login" : "Register"}`}
            desc="Apna account aur khata dekhne ke liye"
            icon="👤"
          />
        </div>

        <Link
          to="/"
          className="block text-center text-sm font-semibold text-gray-600 underline"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}