import { Outlet } from "react-router-dom";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="pb-24">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}