import { searchMeals } from "@/lib/mealdb";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json(
      { error: "The q parameter must contain at least 2 characters." },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const meals = await searchMeals(query);

  return Response.json(
    {
      results: meals.slice(0, 8).map((meal) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        thumb: meal.strMealThumb,
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
