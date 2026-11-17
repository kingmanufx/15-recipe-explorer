"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf8f3] px-6 text-stone-900">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          We couldn&apos;t load this page.
        </h1>
        <p className="mt-3 leading-7 text-stone-600">
          Please try again. If the problem continues, come back in a little
          while.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
