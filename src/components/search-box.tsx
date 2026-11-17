"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

export default function SearchBox({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (query === initialQuery) {
      return;
    }

    const timeout = window.setTimeout(() => {
      const searchTerm = query.trim();
      const href = searchTerm
        ? `/search?q=${encodeURIComponent(searchTerm)}`
        : "/search";

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [initialQuery, query, router, startTransition]);

  return (
    <div>
      <label htmlFor="search-page-query" className="sr-only">
        Search all recipes
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 shadow-sm focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100">
        <input
          id="search-page-query"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try a dish, ingredient, or recipe..."
          className="min-h-14 min-w-0 flex-1 bg-transparent text-stone-900 outline-none placeholder:text-stone-400"
        />
        <span
          className="shrink-0 text-sm text-stone-500"
          aria-live="polite"
          role="status"
        >
          {isPending ? "Updating..." : ""}
        </span>
      </div>
      <p className="mt-2 text-sm text-stone-500">
        Your search is saved in the URL so you can share it.
      </p>
    </div>
  );
}
