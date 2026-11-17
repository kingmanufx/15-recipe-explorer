import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { getCategories } from "@/lib/mealdb";

export default async function Home() {
  const categories = await getCategories();

  return (
    <main className="min-h-screen bg-[#faf8f3] text-stone-900">
      <SiteHeader />

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-10 lg:px-10 lg:pt-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          Find your next favorite
        </p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Good food starts with a little inspiration.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-stone-600">
          Explore recipes by category and discover something delicious to make
          today.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-stone-500">
              Browse the collection
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Recipe categories
            </h2>
          </div>
          <span className="pb-1 text-sm text-stone-500">
            {categories.length} categories
          </span>
        </div>

        {categories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.idCategory}
                href={`/category/${encodeURIComponent(category.strCategory)}`}
                className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <Image
                    src={category.strCategoryThumb}
                    alt={`${category.strCategory} dishes`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold">
                    {category.strCategory}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">
                    {category.strCategoryDescription}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                    Explore recipes <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-600">
            No categories are available right now. Please try again later.
          </p>
        )}
      </section>
    </main>
  );
}
