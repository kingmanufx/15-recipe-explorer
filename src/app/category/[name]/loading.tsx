export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#faf8f3] px-6 py-10 lg:px-10"
      aria-label="Loading category"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-12 w-72 animate-pulse rounded bg-stone-200" />
        <div className="mt-4 h-6 max-w-3xl animate-pulse rounded bg-stone-200" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-stone-200" />
              <div className="m-5 h-5 w-3/4 animate-pulse rounded bg-stone-200" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
