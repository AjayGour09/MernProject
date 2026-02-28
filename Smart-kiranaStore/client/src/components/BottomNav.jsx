import { NavLink } from "react-router-dom";

function Tab({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-semibold transition
         ${isActive ? "text-black" : "text-gray-500"}`
      }
    >
      <div
        className={`grid h-9 w-14 place-items-center rounded-2xl transition ${
          window.location.pathname === to ? "bg-black text-white" : "bg-gray-100"
        }`}
      >
        <span className="text-base">{icon}</span>
      </div>
      <span>{label}</span>
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white">
      <div className="mx-auto flex max-w-md px-2">
        <Tab to="/" label="Home" icon="🏠" />
        <Tab to="/khata" label="Khata" icon="📒" />
        <Tab to="/stock" label="Stock" icon="📦" />
        <Tab to="/sales" label="Sales" icon="💰" />
      </div>
    </div>
  );
}