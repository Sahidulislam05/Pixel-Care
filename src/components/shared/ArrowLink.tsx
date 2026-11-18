import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Text link with an arrow that slides on hover; used for "see all" style links. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium shadow-xs transition-all hover:border-primary/40 hover:text-primary",
        className,
      )}
    >
      {children}
      <span className="flex size-6 items-center justify-center rounded-lg bg-muted transition-all group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowUpRightIcon className="size-3.5" />
      </span>
    </Link>
  );
}
