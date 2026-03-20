import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 pb-28 pt-6">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}