import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategories,
  getMealsByCategory,
  type MealCategory,
} from "@/lib/mealdb";

interface CategoryPageProps {
  params: Promise<{ name: string }>;
}

async function findCategory(name: string): Promise<MealCategory | undefined> {
  const categories = await getCategories();
  const normalizedName = name.toLowerCase();

  return categories.find(
    (category) => category.strCategory.toLowerCase() === normalizedName,
  );
}

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({ name: category.strCategory }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.strCategory,
    description: `Explore ${category.strCategory.toLowerCase()} recipes. ${category.strCategoryDescription.slice(0, 140)}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params;
  const category = await findCategory(name);

  if (!category) {
    notFound();
  }

  const meals = await getMealsByCategory(category.strCategory);

  return (
    <main className="min-h-screen bg-[#faf8f3] text-stone-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-tight">
          simmer<span className="text-orange-600">.</span>
        </Link>
        <Link
          href="/"
          className="text-sm font-semibold text-stone-600 transition hover:text-orange-700"
        >
          All categories
        </Link>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
          Recipe collection
        </p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tight">
          {category.strCategory}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          {category.strCategoryDescription}
        </p>

        <div className="mb-7 mt-12 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Recipes to try
          </h2>
          <span className="pb-1 text-sm text-stone-500">
            {meals.length} recipes
          </span>
        </div>

        {meals.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {meals.map((meal) => (
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
                <h3 className="p-5 text-lg font-semibold">{meal.strMeal}</h3>
              </Link>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-stone-200 bg-white p-8 text-stone-600">
            No recipes were found in this category.
          </p>
        )}
      </section>
    </main>
  );
}
