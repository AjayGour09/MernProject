export default function Container({ title, right, children }) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-4">
        {/* Header */}
        <div className="sticky top-0 z-20 mb-4 rounded-2xl bg-white/90 px-4 py-4 shadow-sm backdrop-blur ring-1 ring-black/5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-gray-900">
                {title}
              </h1>
            </div>

            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        </div>

        {/* Page content */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}