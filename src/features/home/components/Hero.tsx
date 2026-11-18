import { ArrowRightIcon, LockKeyholeIcon, TimerIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { EcgLine } from "@/components/shared/EcgLine";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { HeroAskBox } from "./HeroAskBox";
import { HeroLiveCard } from "./HeroLiveCard";

// Exactly five: the CSS rotator is tuned for a five-word cycle.
const ROTATING_SPECIALISTS = [
  "cardiologist",
  "pediatrician",
  "dermatologist",
  "neurologist",
  "psychiatrist",
];

export function Hero() {
  return (
    <section className="grain relative -mt-24 overflow-hidden pt-24">
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0"
      />
      <EcgLine className="pointer-events-none absolute inset-x-0 bottom-6 h-28 opacity-70" />

      <div className="container-page relative grid min-h-[62vh] items-center gap-14 py-12 lg:min-h-[68vh] lg:grid-cols-[1.2fr_1fr] lg:py-16">
        <div className="space-y-8">
          <h1
            className="animate-fade-up font-display text-5xl leading-[0.95] text-balance sm:text-7xl lg:text-[5.25rem]"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            See a{" "}
            <span
              className="word-rotator text-primary italic"
              aria-hidden="true"
            >
              {ROTATING_SPECIALISTS.map((word, i) => (
                <span key={word} style={{ "--i": i } as React.CSSProperties}>
                  {word}
                </span>
              ))}
            </span>
            <span className="sr-only">specialist</span>
            <br />
            <span className="text-foreground/90">today, </span>
            <em className="text-highlight">from home.</em>
          </h1>

          <p
            className="animate-fade-up max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Book an open slot, pay with bKash, join the video call. Your invoice
            and prescription arrive by email. No queues, no travel.
          </p>

          <div
            className="animate-fade-up flex flex-col gap-3 sm:flex-row"
            style={{ "--i": 3 } as React.CSSProperties}
          >
            <Link
              href="/doctors?available=today"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group shadow-lg shadow-primary/25",
              )}
            >
              Book a doctor today
              <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/doctors"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Browse all specialists
            </Link>
          </div>

          <div
            className="animate-fade-up"
            style={{ "--i": 4 } as React.CSSProperties}
          >
            <HeroAskBox />
          </div>
        </div>

        <div
          className="relative animate-fade-up"
          style={{ "--i": 3 } as React.CSSProperties}
        >
          {/* Floating facts around the live panel. */}
          <div
            className="animate-float absolute -top-6 -left-4 z-10 hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm shadow-lg sm:flex"
            style={{ "--tilt": "-4deg" } as React.CSSProperties}
          >
            <LockKeyholeIcon className="size-4 text-secondary-foreground" />{" "}
            Secure bKash checkout
          </div>
          <div
            className="animate-float absolute -right-3 -bottom-5 z-10 hidden items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm shadow-lg sm:flex"
            style={
              {
                "--tilt": "3deg",
                animationDelay: "1.5s",
              } as React.CSSProperties
            }
          >
            <TimerIcon className="size-4 text-highlight" /> 20-min slots, no
            waiting room
          </div>
          <Suspense fallback={<Skeleton className="h-105 w-full" />}>
            <HeroLiveCard />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
