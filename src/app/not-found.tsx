import { CompassIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <span className="flex size-16 items-center justify-center rounded-xl bg-accent text-accent-foreground">
        <CompassIcon className="size-8" />
      </span>
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="text-3xl font-bold sm:text-4xl">
        We couldn't find that page
      </h1>
      <p className="max-w-md text-muted-foreground">
        The link may be broken, or the page may have moved. Let's get you back
        on track.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link
          href="/doctors"
          className={buttonVariants({ variant: "outline" })}
        >
          Find a doctor
        </Link>
      </div>
    </main>
  );
}
