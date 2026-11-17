"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type KeyboardEvent } from "react";

interface SearchSuggestion {
  id: string;
  name: string;
  thumb: string;
}

interface SearchResponse {
  results: SearchSuggestion[];
}

export default function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Autocomplete request failed (${response.status})`);
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data.results);
        setActiveIndex(-1);
      } catch (requestError) {
        if (
          requestError instanceof DOMException &&
          requestError.name === "AbortError"
        ) {
          return;
        }

        setError("Suggestions are temporarily unavailable.");
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 200);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function selectSuggestion(suggestion: SearchSuggestion) {
    setIsOpen(false);
    setQuery("");
    router.push(`/meal/${suggestion.id}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    if (results.length === 0) {
      if (event.key === "Enter" && query.trim().length >= 2) {
        event.preventDefault();
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((index) =>
        index <= 0 ? results.length - 1 : index - 1,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0) {
        selectSuggestion(results[activeIndex]);
      } else {
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    }
  }

  const listId = "header-search-suggestions";

  return (
    <div className="relative">
      <label htmlFor="header-recipe-search" className="sr-only">
        Search recipes
      </label>
      <input
        id="header-recipe-search"
        type="search"
        value={query}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setResults([]);
          setIsLoading(nextQuery.trim().length >= 2);
          setError(null);
          setActiveIndex(-1);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search recipes..."
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          activeIndex >= 0 ? `header-suggestion-${activeIndex}` : undefined
        }
        className="w-full rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
      />

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl">
          <ul id={listId} role="listbox" aria-label="Recipe suggestions">
            {results.map((result, index) => (
              <li key={result.id} role="presentation">
                <Link
                  id={`header-suggestion-${index}`}
                  href={`/meal/${result.id}`}
                  role="option"
                  aria-selected={activeIndex === index}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`flex items-center gap-3 px-4 py-3 transition ${
                    activeIndex === index ? "bg-orange-50" : "hover:bg-stone-50"
                  }`}
                >
                  <Image
                    src={result.thumb}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800">
                    {result.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {isLoading ? (
            <p className="px-4 py-3 text-sm text-stone-500" role="status">
              Looking for recipes...
            </p>
          ) : error ? (
            <p className="px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-stone-500">
              {query.trim().length < 2
                ? "Type at least 2 characters to search."
                : "No matching recipes found."}
            </p>
          ) : null}

          {query.trim().length >= 2 && (
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => setIsOpen(false)}
              className="block border-t border-stone-100 px-4 py-3 text-sm font-semibold text-orange-700 hover:bg-orange-50"
            >
              See all results
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
