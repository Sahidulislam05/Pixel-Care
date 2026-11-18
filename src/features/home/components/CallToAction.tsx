import { ArrowUpRightIcon } from "lucide-react";
import Link from "next/link";
import { EcgLine } from "@/components/shared/EcgLine";

const PATHS = [
  {
    href: "/register",
    kicker: "For patients",
    title: "Create a free account",
    text: "Book, pay and keep every invoice and prescription in one place.",
  },
  {
    href: "/apply-as-doctor",
    kicker: "For doctors",
    title: "Apply to join",
    text: "Set your own schedule and fee, and write digital prescriptions.",
  },
];

export function CallToAction() {
  return (
    <section className="section container-page" aria-labelledby="cta-heading">
      <div className="grain reveal relative overflow-hidden rounded-xl bg-primary px-6 py-14 text-primary-foreground sm:px-12 sm:py-20">
        <EcgLine
          className="absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 opacity-30"
          strokeClassName="stroke-primary-foreground"
        />
        <div className="relative grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2
            id="cta-heading"
            className="font-display text-5xl leading-[0.95] text-balance sm:text-6xl lg:text-7xl"
          >
            Your next consultation is{" "}
            <em className="text-primary-foreground/70 italic">
              a few clicks away.
            </em>
          </h2>
          <ul className="grid gap-3">
            {PATHS.map((path) => (
              <li key={path.href}>
                <Link
                  href={path.href}
                  className="group flex items-start justify-between gap-4 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-5 backdrop-blur transition-all hover:bg-primary-foreground hover:text-primary"
                >
                  <span>
                    <span className="font-mono text-xs tracking-wider uppercase opacity-70">
                      {path.kicker}
                    </span>
                    <span className="mt-1 block font-display text-3xl">
                      {path.title}
                    </span>
                    <span className="mt-1 block text-sm opacity-80">
                      {path.text}
                    </span>
                  </span>
                  <ArrowUpRightIcon className="size-6 shrink-0 transition-transform group-hover:rotate-45" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
