import "server-only";

const API_BASE = "https://www.themealdb.com/api/json/v1/1";

export interface MealCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Ingredient {
  name: string;
  measure: string;
}

interface RawMeal extends MealSummary {
  strArea: string;
  strCategory: string;
  strInstructions: string;
  strTags?: string | null;
  strYoutube?: string | null;
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
}

export interface Meal extends MealSummary {
  strArea: string;
  strCategory: string;
  strInstructions: string;
  strTags?: string | null;
  strYoutube?: string | null;
  ingredients: Ingredient[];
}

interface CategoriesResponse {
  categories: MealCategory[] | null;
}

interface MealsResponse<T> {
  meals: T[] | null;
}

async function fetchJson<T>(url: string, revalidate: number): Promise<T> {
  const response = await fetch(url, { next: { revalidate } });

  if (!response.ok) {
    throw new Error(
      `TheMealDB request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

function normalizeMeal(meal: RawMeal): Meal {
  const ingredients: Ingredient[] = [];

  for (let index = 1; index <= 20; index += 1) {
    const name = meal[`strIngredient${index}`]?.trim() ?? "";
    const measure = meal[`strMeasure${index}`]?.trim() ?? "";

    if (name) {
      ingredients.push({ name, measure });
    }
  }

  return {
    idMeal: meal.idMeal,
    strMeal: meal.strMeal,
    strMealThumb: meal.strMealThumb,
    strArea: meal.strArea,
    strCategory: meal.strCategory,
    strInstructions: meal.strInstructions,
    strTags: meal.strTags,
    strYoutube: meal.strYoutube,
    ingredients,
  };
}

export async function getCategories(): Promise<MealCategory[]> {
  const data = await fetchJson<CategoriesResponse>(
    `${API_BASE}/categories.php`,
    86_400,
  );

  return data.categories ?? [];
}

export async function getMealsByCategory(
  category: string,
): Promise<MealSummary[]> {
  const data = await fetchJson<MealsResponse<MealSummary>>(
    `${API_BASE}/filter.php?c=${encodeURIComponent(category)}`,
    3_600,
  );

  return data.meals ?? [];
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const data = await fetchJson<MealsResponse<MealSummary>>(
    `${API_BASE}/search.php?s=${encodeURIComponent(trimmedQuery)}`,
    3_600,
  );

  return data.meals ?? [];
}

export async function getMeal(id: string): Promise<Meal | null> {
  const data = await fetchJson<MealsResponse<RawMeal>>(
    `${API_BASE}/lookup.php?i=${encodeURIComponent(id)}`,
    3_600,
  );
  const meal = data.meals?.[0];

  return meal ? normalizeMeal(meal) : null;
}
