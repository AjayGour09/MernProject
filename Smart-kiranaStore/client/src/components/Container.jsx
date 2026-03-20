export default function Container({ title, subtitle, right, children }) {
  return (
    <div className="lg:pl-72">
      <div className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-4 pb-28 pt-4 md:px-6 md:pt-6 lg:px-8">
          <div className="sticky top-0 z-30 -mx-2 mb-6 rounded-[28px] border border-slate-200/80 bg-white/85 px-4 py-4 shadow-sm backdrop-blur md:mx-0 md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
                  {title}
                </h1>

                {subtitle ? (
                  <p className="mt-2 text-sm text-slate-500 md:text-base">
                    {subtitle}
                  </p>
                ) : null}
              </div>

              {right ? <div className="shrink-0">{right}</div> : null}
            </div>
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}