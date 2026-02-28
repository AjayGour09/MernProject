export default function Container({ title, right, children }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 pb-24 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {right}
      </div>
      {children}
    </div>
  );
}