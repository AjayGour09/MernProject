import { Link } from "react-router-dom";

function CardLink({ to, title, sub, dark = false, icon }) {
  return (
    <Link
      to={to}
      className={`block rounded-3xl p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99] ${
        dark ? "bg-black text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${
            dark ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-base font-extrabold">{title}</div>
          <div className={`mt-1 text-sm ${dark ? "text-white/75" : "text-gray-500"}`}>
            {sub}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="rounded-[32px] bg-black p-6 text-white shadow-sm">
        <div className="text-sm font-semibold text-white/70">Smart Kirana</div>
        <div className="mt-3 text-4xl font-extrabold leading-tight tracking-tight">
          Shop aur Customer
          <br />
          dono ke liye smart system
        </div>
        <div className="mt-3 text-sm leading-6 text-white/75">
          Admin apni shop manage kare, customer apna khata aur history dekhe.
        </div>
      </div>

      {/* Access */}
      <div className="rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="text-sm font-bold text-gray-900">Choose your access</div>

        <div className="mt-4 grid gap-3">
          <CardLink
            to="/admin/login"
            title="Admin Login"
            sub="Shop owner ke liye login"
            icon="🔐"
            dark
          />
          <CardLink
            to="/admin/setup"
            title="Admin Register"
            sub="Naya admin account banao"
            icon="📝"
          />
          <CardLink
            to="/customer/login"
            title="Customer Login"
            sub="Apna khata dekhne ke liye login"
            icon="👤"
          />
          <CardLink
            to="/customer/set-password"
            title="Customer Set Password"
            sub="Pehli baar password set karo"
            icon="🔑"
          />
        </div>
      </div>

      {/* Features */}
      <div className="rounded-[32px] bg-white p-5 shadow-sm ring-1 ring-black/5">
        <div className="text-sm font-bold text-gray-900">What you can do</div>

        <div className="mt-4 grid gap-3">
          <div className="rounded-2xl border p-4">
            <div className="text-sm font-bold text-gray-900">For Admin</div>
            <div className="mt-2 text-sm leading-6 text-gray-500">
              Shop create karo, customer add karo, khata manage karo, stock aur
              daily sales track karo.
            </div>
          </div>

          <div className="rounded-2xl border p-4">
            <div className="text-sm font-bold text-gray-900">For Customer</div>
            <div className="mt-2 text-sm leading-6 text-gray-500">
              Apni linked shops dekho, baki ya advance check karo, aur
              transaction history access karo.
            </div>
          </div>
        </div>
      </div>

      <div className="pb-2 text-center text-xs text-gray-500">
        Multi-shop kirana workflow
      </div>
    </div>
  );
}