import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Id for aria-labelledby on the parent section. */
  id?: string;
  /** Small index shown before the label, e.g. "01". */
  index?: string;
  eyebrow?: string;
  /** Wrap words in <em> to set them in italic coral serif. */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
};

/** Editorial section header: mono index + label, large serif title. */
export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "reveal mb-12 flex flex-col gap-5",
        align === "center"
          ? "items-center text-center"
          : "lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div
        className={cn("max-w-2xl space-y-4", align === "center" && "mx-auto")}
      >
        {(index || eyebrow) && (
          <p className="flex items-center gap-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            {index && <span className="text-primary">({index})</span>}
            {eyebrow}
            {align === "left" && (
              <span
                className="hidden h-px w-12 bg-border sm:block"
                aria-hidden="true"
              />
            )}
          </p>
        )}
        <h2
          id={id}
          className="font-display text-4xl leading-[1.05] text-balance sm:text-5xl lg:text-6xl [&_em]:text-highlight [&_em]:italic"
        >
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
