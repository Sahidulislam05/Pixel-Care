import { cacheLife } from "next/cache";

// Cache Components forbids reading the clock during prerender; caching the
// year (refreshed daily) keeps the footer fully static.
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
