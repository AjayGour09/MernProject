import { useLocation, useNavigate } from "react-router-dom";

export default function Container({ title, right, children }) {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const showBack = pathname !== "/";

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top App Bar */}
      <div className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-center gap-3 px-4 py-3">
          {showBack ? (
            <button
              onClick={() => nav(-1)}
              className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold active:scale-[0.99]"
              aria-label="Back"
            >
              ← Back
            </button>
          ) : (
            <div className="w-[74px]" />
          )}

          <div className="flex-1">
            <div className="text-[11px] font-semibold text-gray-500">
              Smart Kirana
            </div>
            <div className="text-base font-extrabold text-gray-900">
              {title}
            </div>
          </div>

          <div>{right}</div>
        </div>
      </div>

      {/* Page Content */}
      <div className="mx-auto w-full max-w-md px-4 pb-28 pt-4">
        {children}
      </div>
    </div>
  );
}