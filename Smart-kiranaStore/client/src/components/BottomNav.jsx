import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  WalletCards,
  Boxes,
  ChartColumn,
  Store,
  LogOut,
} from "lucide-react";
import { AuthService } from "../services/auth";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/khata", label: "Khata", icon: WalletCards },
  { to: "/stock", label: "Stock", icon: Boxes },
  { to: "/sales", label: "Sales", icon: ChartColumn },
];

export default function BottomNav() {
  const user = AuthService.getUser();

  const logout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-slate-200 lg:bg-white">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-lg font-black tracking-tight text-slate-900">
              Smart Kirana
            </div>
            <div className="truncate text-xs text-slate-500">
              Store management platform
            </div>
          </div>
        </div>

        <div className="border-b border-slate-100 px-6 py-5">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Logged in as
          </div>
          <div className="mt-2 truncate text-base font-bold text-slate-900">
            {user?.name || "User"}
          </div>
          <div className="mt-1 truncate text-sm text-slate-500">
            {user?.email || user?.phone || ""}
          </div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <div className="space-y-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 lg:hidden">
        <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-6 gap-1">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon className="mb-1 h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}

            <button
              onClick={logout}
              className="flex flex-col items-center rounded-2xl px-2 py-2 text-[11px] font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mb-1 h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}