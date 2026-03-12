export default function Container({ title, right, children }) {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-gray-100 px-4 pb-24 pt-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-extrabold text-gray-900">
            {title}
          </h1>
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>

      {children}
    </div>
  );
}