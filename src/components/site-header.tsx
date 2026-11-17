import Link from "next/link";
import HeaderSearch from "./header-search";

export default function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-6 lg:px-10">
      <Link href="/" className="shrink-0 text-xl font-bold tracking-tight">
        simmer<span className="text-orange-600">.</span>
      </Link>
      <div className="ml-auto w-full max-w-md">
        <HeaderSearch />
      </div>
    </header>
  );
}
