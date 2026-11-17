export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#faf8f3] px-6 py-10 lg:px-10"
      aria-label="Loading recipe"
      aria-busy="true"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-stone-200" />
          <div className="space-y-5 py-8">
            <div className="h-5 w-40 animate-pulse rounded bg-stone-200" />
            <div className="h-12 w-3/4 animate-pulse rounded bg-stone-200" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
        <div className="mt-10 grid gap-12 border-t border-stone-200 pt-10 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="h-8 w-40 animate-pulse rounded bg-stone-200" />
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-6 animate-pulse rounded bg-stone-200"
              />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
            {Array.from({ length: 5 }, (_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded bg-stone-200"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
