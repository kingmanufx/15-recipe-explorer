This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Recipe explorer

The home page lists TheMealDB categories. Open a category to browse its recipes.
API access and normalized recipe types are in `src/lib/mealdb.ts`; category
images are allowed through the `www.themealdb.com` image remote pattern.

## Data caching

The explorer uses Next.js `fetch` revalidation: categories are cached for 24
hours and recipe searches, category lists, and individual recipes for 1 hour.
`force-cache` keeps a response in the persistent Data Cache until it is
revalidated or invalidated. `next: { revalidate: seconds }` also caches it,
then permits refresh after that time. `no-store` skips the persistent cache and
fetches fresh data on each request.

The defaults changed between framework versions: in Next.js 14, server-side
`fetch` was cached by default; starting in Next.js 15 it is uncached by default,
so caching should be explicit. This project currently has Next.js 16 installed,
but uses the same explicit `fetch` revalidation style by leaving Cache
Components disabled.

## Streaming

On a recipe page, the recipe details render independently from the related
recipes section. The latter is inside a React `Suspense` boundary, so Next.js
can send the main recipe first and stream in the related cards when their data
is ready. The fallback skeleton keeps the page visually complete while that
slower section loads. In development, the related section waits one second to
make the streaming state easy to observe; production requests have no added
delay.

## Search and server entry points

The `/search?q=...` page reads the URL query on the server and fetches results
directly through `searchMeals`; the `SearchBox` updates that URL after a
300 ms pause, making searches bookmarkable and shareable. The header's
autocomplete calls `/api/search`, whose Route Handler returns a small JSON
response with cache headers and a 400 response for queries shorter than two
characters.

Use a Server Component for data needed to render a page: it avoids a browser
round-trip and keeps server-only credentials and data access out of client
code. Use a Route Handler when you need an HTTP endpoint for client-side
features, third-party consumers, or explicit HTTP status and cache headers.
Use a Server Action for mutations triggered by the UI, such as saving a
favorite or submitting a form; it runs server-side and can update or revalidate
data without building a separate HTTP API.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
