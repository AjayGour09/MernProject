import { AuthService } from "../../services/auth";
import { LogOut, ShieldCheck, Mail, LayoutDashboard } from "lucide-react";

export default function AdminPage() {
  const user = AuthService.getUser();

  const logout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-emerald-500 px-6 py-8 text-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </div>

              <h1 className="mt-4 text-4xl font-bold">
                {user?.name || "Admin"}
              </h1>

              <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <Mail className="h-4 w-4" />
                {user?.email || ""}
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" />
                Admin Access Active
              </div>

              <div className="mt-2 text-2xl font-bold">Secure Session</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-500">
              Customers
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">124</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-500">
              Pending Khata
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">₹4,250</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-medium text-slate-500">
              Stock Alerts
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">07</div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="text-2xl font-bold text-slate-900">
            Welcome Admin 👋
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            Dashboard successfully open ho gaya. Ab aap billing, stock,
            customers aur khata management modules ko access kar sakte hain.
          </p>

          <button
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}