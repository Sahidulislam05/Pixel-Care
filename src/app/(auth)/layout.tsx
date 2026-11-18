import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { EcgLine } from "@/components/shared/EcgLine";

const POINTS = [
  "Verified doctors, 34 specialities",
  "Same-day video consultations",
  "Secure sessions & bKash payments",
];

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      {/* Calming brand panel: reassurance before asking for personal details. */}
      <aside className="grain relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0 opacity-30 invert dark:invert-0"
        />
        <Logo className="relative text-primary-foreground [&_span_span]:text-primary-foreground/80" />
        <div className="relative space-y-10">
          <h2 className="font-display text-6xl leading-[0.95] text-balance xl:text-7xl">
            Care that comes <em className="opacity-70">to you.</em>
          </h2>
          <EcgLine
            className="-mx-12 h-24 w-[calc(100%+6rem)]"
            strokeClassName="stroke-primary-foreground"
          />
          <ul className="space-y-3 font-mono text-sm tracking-wide">
            {POINTS.map((text, i) => (
              <li
                key={text}
                className="animate-fade-up flex items-center gap-3 opacity-90"
                style={{ "--i": i + 2 } as React.CSSProperties}
              >
                <span className="text-primary-foreground/50">0{i + 1}</span>{" "}
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative font-mono text-xs tracking-wider uppercase opacity-70">
          Not for emergencies · Call 999
        </p>
      </aside>

      <main className="flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6">
          <Logo className="lg:invisible" />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-6">
          <div className="animate-fade-up w-full max-w-md">{children}</div>
        </div>
      </main>
    </div>
  );
}
