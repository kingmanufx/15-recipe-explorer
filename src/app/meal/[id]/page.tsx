import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getMeal,
  getMealsByCategory,
  type MealSummary,
} from "@/lib/mealdb";

interface MealPageProps {
  params: Promise<{ id: string }>;
}

function getYoutubeEmbedUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch (error) {
    if (error instanceof TypeError) {
      return null;
    }

    throw error;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return null;
  }

  let videoId: string | null = null;

  if (url.hostname === "youtu.be") {
    videoId = url.pathname.split("/")[1] ?? null;
  } else if (
    ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(url.hostname)
  ) {
    if (url.pathname === "/watch") {
      videoId = url.searchParams.get("v");
    } else {
      videoId = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)\/?$/)?.[1] ?? null;
    }
  }

  if (!videoId || !/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return null;
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export async function generateMetadata({
  params,
}: MealPageProps): Promise<Metadata> {
  const { id } = await params;
  const meal = await getMeal(id);

  return meal
    ? {
        title: meal.strMeal,
        description: `${meal.strArea} ${meal.strCategory.toLowerCase()} recipe.`,
      }
    : { title: "Recipe not found" };
}

export default async function MealPage({ params }: MealPageProps) {
  const { id } = await params;
  const meal = await getMeal(id);

  if (!meal) {
    notFound();
  }

  const tags = meal.strTags
    ?.split(",")
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];
  const steps = meal.strInstructions
    .split(/\r?\n/)
    .map((step) => step.trim())
    .filter(Boolean);
  const youtubeEmbedUrl = getYoutubeEmbedUrl(meal.strYoutube);

  return (
    <main className="min-h-screen bg-[#faf8f3] text-stone-900">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-xl font-bold tracking-tight">
          simmer<span className="text-orange-600">.</span>
        </Link>
        <Link
          href={`/category/${encodeURIComponent(meal.strCategory)}`}
          className="text-sm font-semibold text-stone-600 transition hover:text-orange-700"
        >
          More {meal.strCategory} recipes
        </Link>
      </header>

      <article className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <section className="grid gap-8 pb-12 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-stone-200 shadow-lg">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
              {meal.strArea} cuisine
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {meal.strMeal}
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              A recipe from{" "}
              <Link
                href={`/category/${encodeURIComponent(meal.strCategory)}`}
                className="font-semibold text-stone-900 underline decoration-orange-400 decoration-2 underline-offset-4"
              >
                {meal.strCategory}
              </Link>
              .
            </p>
            {tags.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Recipe tags">
                {tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-900"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="grid gap-12 border-t border-stone-200 pt-10 lg:grid-cols-[0.8fr_1.2fr]">
          <section aria-labelledby="ingredients-heading">
            <h2
              id="ingredients-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Ingredients
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Check off each item as you get it ready.
            </p>
            <ul className="mt-6 divide-y divide-stone-200">
              {meal.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.name}-${index}`}>
                  <label className="flex cursor-pointer items-center gap-3 py-3 text-stone-700 has-[:checked]:text-stone-400 has-[:checked]:line-through">
                    <input
                      type="checkbox"
                      className="size-4 accent-orange-600"
                    />
                    <span className="flex-1">{ingredient.name}</span>
                    {ingredient.measure && (
                      <span className="text-sm text-stone-500">
                        {ingredient.measure}
                      </span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="instructions-heading">
            <h2
              id="instructions-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Instructions
            </h2>
            {steps.length > 0 ? (
              <ol className="mt-6 space-y-6">
                {steps.map((step, index) => (
                  <li key={`${index}-${step.slice(0, 24)}`} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800">
                      {index + 1}
                    </span>
                    <p className="pt-1 leading-7 text-stone-700">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-5 text-stone-600">
                Instructions are not available for this recipe.
              </p>
            )}
          </section>
        </div>

        {youtubeEmbedUrl && (
          <section className="mt-14" aria-labelledby="video-heading">
            <h2 id="video-heading" className="text-2xl font-semibold tracking-tight">
              Watch the recipe
            </h2>
            <div className="mt-5 aspect-video overflow-hidden rounded-2xl bg-stone-200">
              <iframe
                src={youtubeEmbedUrl}
                title={`${meal.strMeal} recipe video`}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <Suspense fallback={<Skeleton />}>
          <MoreFromCategory
            category={meal.strCategory}
            currentMealId={meal.idMeal}
          />
        </Suspense>
      </article>
    </main>
  );
}

async function MoreFromCategory({
  category,
  currentMealId,
}: {
  category: string;
  currentMealId: string;
}) {
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  const meals = (await getMealsByCategory(category))
    .filter((meal) => meal.idMeal !== currentMealId)
    .slice(0, 4);

  if (meals.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 border-t border-stone-200 pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">
        More from this category
      </h2>
      <MealCards meals={meals} />
    </section>
  );
}

function MealCards({ meals }: { meals: MealSummary[] }) {
  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
          <h3 className="p-4 font-semibold">{meal.strMeal}</h3>
        </Link>
      ))}
    </div>
  );
}

function Skeleton() {
  return (
    <section
      className="mt-16 border-t border-stone-200 pt-10"
      aria-label="Loading more recipes"
      aria-busy="true"
    >
      <div className="h-8 w-64 animate-pulse rounded bg-stone-200" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
          >
            <div className="aspect-[4/3] animate-pulse bg-stone-200" />
            <div className="m-4 h-5 w-3/4 animate-pulse rounded bg-stone-200" />
          </div>
        ))}
      </div>
    </section>
  );
}
