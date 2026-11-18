import type { ReactNode } from "react";
import { EcgLine } from "./EcgLine";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

/** Hero band at the top of inner public pages. Wrap words in <em> for the coral serif accent. */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="grain relative -mt-24 overflow-hidden border-b pt-24">
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0"
      />
      <EcgLine className="pointer-events-none absolute inset-x-0 bottom-2 h-16 opacity-50" />
      <div className="container-page relative py-14 sm:py-20">
        {eyebrow && (
          <p className="animate-fade-up mb-5 flex items-center gap-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <span
              className="size-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
            {eyebrow}
          </p>
        )}
        <h1
          className="animate-fade-up font-display max-w-4xl text-5xl leading-[0.98] text-balance sm:text-6xl lg:text-7xl [&_em]:text-highlight [&_em]:italic"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {title}
        </h1>
        {description && (
          <p
            className="animate-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
