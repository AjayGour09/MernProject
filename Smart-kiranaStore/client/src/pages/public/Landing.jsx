import { Link } from "react-router-dom";
import { Store, Users, Boxes, Wallet } from "lucide-react";

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
        {icon}
      </div>

      <h3 className="mt-4 text-lg font-extrabold tracking-tight text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-gray-500">{text}</p>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-gray-900">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white">
              <Store className="h-5 w-5" />
            </div>

            <div>
              <div className="text-lg font-black tracking-tight">
                Smart Kirana
              </div>
              <div className="text-xs text-gray-500">
                Simple store management
              </div>
            </div>
          </div>

          <Link
            to="/auth-gateway"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-900"
          >
            Start
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
            Easy for admin and customer
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight md:text-6xl">
            Smart way to manage
            <span className="block">your kirana store</span>
          </h1>

          <p className="mt-5 text-base leading-8 text-gray-600 md:text-lg">
            Customers, khata, stock aur sales ko ek clean aur simple system me
            manage karo.
          </p>

          <Link
            to="/auth-gateway"
            className="mt-8 inline-flex rounded-2xl bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900"
          >
            Start Now
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-8 md:pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Feature
            icon={<Users className="h-5 w-5" />}
            title="Customers"
            text="Customer details aur balance easily manage karo."
          />

          <Feature
            icon={<Wallet className="h-5 w-5" />}
            title="Khata"
            text="Udhaar aur payment entries simple flow me save karo."
          />

          <Feature
            icon={<Boxes className="h-5 w-5" />}
            title="Stock"
            text="Low stock aur quantity updates ko track karo."
          />

          <Feature
            icon={<Store className="h-5 w-5" />}
            title="Sales"
            text="Daily cash aur UPI sales ka clean record rakho."
          />
        </div>
      </section>
    </div>
  );
}