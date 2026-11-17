import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SearchBox from "@/components/search-box";
import { searchMeals } from "@/lib/mealdb";

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? (params.q[0] ?? "") : (params.q ?? "");
  const normalizedQuery = query.trim();
  const results =
    normalizedQuery.length >= 2 ? await searchMeals(normalizedQuery) : [];

  return (
    <main className="min-h-screen bg-[#faf8f3] text-stone-900">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          Recipe finder
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Search recipes
        </h1>
        <div className="mt-6 max-w-2xl">
          <SearchBox key={query} initialQuery={query} />
        </div>

        {normalizedQuery.length > 0 && normalizedQuery.length < 2 ? (
          <p className="mt-10 text-stone-600">
            Enter at least 2 characters to search.
          </p>
        ) : normalizedQuery.length >= 2 ? (
          <>
            <h2 className="mb-6 mt-10 text-2xl font-semibold tracking-tight">
              {results.length > 0
                ? `${results.length} ${results.length === 1 ? "recipe" : "recipes"} for “${normalizedQuery}”`
                : `No recipes found for “${normalizedQuery}”`}
            </h2>
            {results.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {results.map((meal) => (
                  <Link
                    key={meal.idMeal}
                    href={`/meal/${meal.idMeal}`}
                    className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                      <Image
                        src={meal.strMealThumb}
                        alt={meal.strMeal}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="p-5 text-lg font-semibold">
                      {meal.strMeal}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="mt-10 text-stone-600">
            Search by meal name to find your next recipe.
          </p>
        )}
      </section>
    </main>
  );
}
