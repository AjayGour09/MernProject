import { Link, useLocation } from "react-router-dom";
import { AuthService } from "../services/auth";

export default function BottomNav() {
  const { pathname } = useLocation();

  const logout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  const items = [
    { to: "/dashboard", label: "Home", icon: "🏠" },
    { to: "/customers", label: "Customers", icon: "👥" },
    { to: "/stock", label: "Stock", icon: "📦" },
    { to: "/sales", label: "Sales", icon: "💰" },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-md rounded-3xl bg-white/95 px-3 py-2 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
        <div className="grid grid-cols-5 gap-2">
          {items.map((item) => {
            const active = pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center rounded-2xl py-2 transition-all duration-200 ${
                  active
                    ? "bg-black text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="mt-1 text-[11px] font-semibold">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="flex flex-col items-center justify-center rounded-2xl py-2 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <span className="text-lg">🚪</span>
            <span className="mt-1 text-[11px] font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}