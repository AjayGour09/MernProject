import { NavLink } from "react-router-dom";

const itemClass =
  "flex-1 py-3 text-center text-sm font-semibold transition";

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="mx-auto flex max-w-md">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? "text-black" : "text-gray-500"}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/khata"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? "text-black" : "text-gray-500"}`
          }
        >
          Khata
        </NavLink>

        <NavLink
          to="/stock"
          className={({ isActive }) =>
            `${itemClass} ${isActive ? "text-black" : "text-gray-500"}`
          }
        >
          Stock
        </NavLink>
      </div>
    </div>
  );
}