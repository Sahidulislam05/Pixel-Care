import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  reverse?: boolean;
  durationSeconds?: number;
  className?: string;
  label: string;
};

/**
 * Infinite horizontal scroller. Items render twice so the loop is seamless; the
 * copy is hidden from assistive tech. Pauses on hover, stops with reduced motion.
 */
export function Marquee({
  children,
  reverse,
  durationSeconds = 40,
  className,
  label,
}: MarqueeProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        "marquee overflow-hidden",
        reverse && "marquee-reverse",
        className,
      )}
      style={
        { "--marquee-duration": `${durationSeconds}s` } as React.CSSProperties
      }
    >
      <div className="marquee-track flex w-max gap-3">
        <div className="flex gap-3">{children}</div>
        <div className="flex gap-3" aria-hidden="true" inert>
          {children}
        </div>
      </div>
    </section>
  );
}
