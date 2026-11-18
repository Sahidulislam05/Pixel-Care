"use client";

import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 text-center">
      <span className="flex size-16 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangleIcon className="size-8" />
      </span>
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error happened while loading this page. Please try again
        in a moment.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </main>
  );
}
