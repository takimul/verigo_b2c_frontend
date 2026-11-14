export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f7f5f0] p-6 animate-pulse">
      <div className="h-7 w-48 rounded bg-neutral-200" />
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xs border border-neutral-200 bg-white" />
        ))}
      </div>
      <div className="mt-6 h-64 rounded-xs border border-neutral-200 bg-white" />
    </div>
  );
}

