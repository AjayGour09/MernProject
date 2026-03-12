import { NavLink } from "react-router-dom";

function Item({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center justify-center py-2 text-xs font-semibold transition ${
          isActive ? "text-black" : "text-gray-500"
        }`
      }
    >
      <div className="text-lg">{icon}</div>
      <div className="mt-1">{label}</div>
    </NavLink>
  );
}

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md">
        <Item to="/" icon="🏠" label="Home" />
        <Item to="/customers" icon="👤" label="Customers" />
        <Item to="/khata" icon="📒" label="Khata" />
        <Item to="/stock" icon="📦" label="Stock" />
        <Item to="/sales" icon="💰" label="Sales" />
      </div>
    </div>
  );
}