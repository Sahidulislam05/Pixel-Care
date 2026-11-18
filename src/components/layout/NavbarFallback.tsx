import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "./Logo";

/** Static header shown while the interactive navbar (needs the session) loads. Same geometry, so nothing shifts. */
export function NavbarFallback() {
  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-4 sm:px-4">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-xl px-3 sm:px-4">
        <Logo />
        <Skeleton className="h-9 w-40" />
      </div>
    </header>
  );
}
