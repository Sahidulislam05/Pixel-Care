import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" className="fill-primary" />
      {/* Medical cross softened into a pixel grid */}
      <path
        d="M13 7h6v6h6v6h-6v6h-6v-6H7v-6h6z"
        className="fill-primary-foreground"
        transform="translate(0 0)"
      />
      <rect
        x="21"
        y="21"
        width="4"
        height="4"
        rx="1"
        className="fill-highlight"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex items-center gap-2 rounded-xl font-heading text-lg font-semibold",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-90" />
      <span className="tracking-tight">
        Pixel
        <span className="font-display text-[1.15em] font-normal text-primary italic">
          Care
        </span>
      </span>
    </Link>
  );
}
