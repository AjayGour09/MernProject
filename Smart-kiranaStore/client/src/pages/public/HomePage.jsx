import { Link } from "react-router-dom";

function NavBtn({ to, children, dark = false }) {
  return (
    <Link
      to={to}
      className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
        dark
          ? "bg-black text-white hover:opacity-90"
          : "border border-black/10 bg-white text-gray-900 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gray-100 text-2xl">
          {icon}
        </div>
        <div>
          <div className="text-lg font-extrabold text-gray-900">{title}</div>
          <div className="mt-2 text-sm leading-6 text-gray-500">{desc}</div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-gray-900">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <div className="text-xl font-extrabold tracking-tight">Smart Kirana</div>
            <div className="text-xs text-gray-500">Multi-role kirana platform</div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a href="#features" className="text-sm font-semibold text-gray-600 hover:text-black">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-gray-600 hover:text-black">
              How it works
            </a>
            <NavBtn to="/choose/register">Register</NavBtn>
            <NavBtn to="/choose/login" dark>
              Login
            </NavBtn>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
              Laptop aur mobile dono ke liye ready
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Smart system
              <br />
              for shop owners
              <span className="block text-gray-500">& customers</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 md:text-lg">
              Ek clean website jahan se admin ya customer login/register kar sake,
              aur apne apne pages par redirect ho jaye.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <NavBtn to="/choose/register">Register</NavBtn>
              <NavBtn to="/choose/login" dark>
                Login
              </NavBtn>
            </div>
          </div>

          <div className="rounded-[32px] bg-black p-6 text-white shadow-xl">
            <div className="text-sm font-semibold text-white/70">Why Smart Kirana?</div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm font-bold">🏪 Admin Access</div>
                <div className="mt-1 text-sm text-white/70">
                  Admin apna dashboard aur business page access karega.
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm font-bold">👤 Customer Access</div>
                <div className="mt-1 text-sm text-white/70">
                  Customer login karke apna account page khol sakta hai.
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-sm font-bold">🔐 Role-based Flow</div>
                <div className="mt-1 text-sm text-white/70">
                  Login/Register ke waqt role choose karo aur sahi page par redirect ho jao.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="mb-6">
          <div className="text-sm font-semibold text-gray-500">Features</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
            Website + Role based auth
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon="🌐"
            title="Website Style Home"
            desc="Proper navbar, hero section, features aur clean CTA buttons."
          />
          <FeatureCard
            icon="🧭"
            title="Role Selection"
            desc="Login ya register se pehle user choose karega admin ya customer."
          />
          <FeatureCard
            icon="⚡"
            title="Direct Redirect"
            desc="Admin apne dashboard par aur customer apne account page par jayega."
          />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
          <div className="text-sm font-semibold text-gray-500">How it works</div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Simple 3-step flow</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-5">
              <div className="text-sm font-bold text-gray-900">01. Open website</div>
              <div className="mt-2 text-sm leading-6 text-gray-500">
                Pehle home page open hoga, bilkul website style me.
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="text-sm font-bold text-gray-900">02. Choose role</div>
              <div className="mt-2 text-sm leading-6 text-gray-500">
                Login ya register karte waqt admin ya customer select karo.
              </div>
            </div>

            <div className="rounded-2xl border p-5">
              <div className="text-sm font-bold text-gray-900">03. Redirect</div>
              <div className="mt-2 text-sm leading-6 text-gray-500">
                Admin dashboard khulega, customer ka own page khulega.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-[32px] bg-black p-6 text-white md:p-8">
          <div className="text-2xl font-extrabold tracking-tight md:text-4xl">
            Start using Smart Kirana
          </div>
          <div className="mt-3 max-w-2xl text-sm leading-6 text-white/75 md:text-base">
            Ab apne role ke hisaab se register ya login karo.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <NavBtn to="/choose/register">Register Now</NavBtn>
            <NavBtn to="/choose/login">Login Now</NavBtn>
          </div>
        </div>
      </section>
    </div>
  );
}