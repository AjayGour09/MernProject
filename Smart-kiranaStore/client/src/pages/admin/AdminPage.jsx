import { AuthService } from "../../services/auth";

export default function AdminPage() {
  const user = AuthService.getUser();

  const logout = () => {
    AuthService.logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8">
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-[32px] bg-black p-6 text-white shadow-sm">
          <div className="text-sm text-white/70">Admin Dashboard</div>
          <div className="mt-2 text-3xl font-extrabold">
            {user?.name || "Admin"}
          </div>
          <div className="mt-1 text-sm text-white/70">
            {user?.email || ""}
          </div>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="text-xl font-extrabold text-gray-900">
            Welcome Admin 👋
          </div>

          <div className="mt-3 text-sm leading-6 text-gray-500">
            Dashboard successfully open ho gaya.
          </div>

          <button
            onClick={logout}
            className="mt-6 w-full rounded-2xl bg-black py-3 font-bold text-white"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}