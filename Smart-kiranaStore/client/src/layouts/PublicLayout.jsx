import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-md px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}