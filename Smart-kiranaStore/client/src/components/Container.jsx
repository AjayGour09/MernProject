export default function Container({ title, subtitle, right, children }) {
  return (
    <div className="min-h-screen bg-[#f4f6f8]">
      <div className="mx-auto max-w-md px-4 pb-28 pt-4">
        <div className="sticky top-0 z-20 mb-4 rounded-[28px] border border-black/5 bg-white/90 px-4 py-4 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[26px] font-black tracking-tight text-gray-900">
                {title}
              </h1>

              {subtitle ? (
                <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
              ) : null}
            </div>

            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        </div>

        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
}