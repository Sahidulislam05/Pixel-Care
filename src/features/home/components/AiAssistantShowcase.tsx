import {
  ArrowUpRightIcon,
  BotIcon,
  ShieldAlertIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PROMPTS = [
  "I have severe acne and hair fall",
  "Heart specialist in Sylhet",
  "My knee hurts after playing football",
  "Which child specialist is available today?",
];

const POINTS = [
  {
    icon: SparklesIcon,
    text: "Understands plain language and suggests the right speciality.",
  },
  {
    icon: BotIcon,
    text: "Recommends only real doctors from our network, with fees, location and today's slots.",
  },
  {
    icon: ShieldAlertIcon,
    text: "Never diagnoses or prescribes, and sends emergencies to the nearest hospital.",
  },
];

export function AiAssistantShowcase() {
  return (
    <section className="section container-page" aria-labelledby="ai-heading">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHeading
            id="ai-heading"
            index="05"
            eyebrow="AI assistant"
            title={
              <>
                Describe how you feel. <em>We'll find who can help.</em>
              </>
            }
            className="mb-8"
          />
          <ul className="reveal space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3 text-muted-foreground">
                <Icon className="mt-0.5 size-5 shrink-0 text-highlight" />
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/ai-assistant"
            className={cn(
              buttonVariants({ size: "lg", variant: "highlight" }),
              "reveal group mt-8",
            )}
          >
            Start a conversation{" "}
            <ArrowUpRightIcon className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>

        {/* The one surface with a living border: it's the platform's "smart" feature. */}
        <div className="reveal border-glow rounded-xl p-px">
          <div className="rounded-[calc(var(--radius)-1px)] bg-card p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
                <BotIcon className="size-5" />
              </span>
              <div>
                <p className="font-semibold">Pixel-Care Assistant</p>
                <p className="font-mono text-xs text-muted-foreground">
                  RAG · VERIFIED DOCTORS ONLY
                </p>
              </div>
            </div>
            <p className="mb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              Try asking
            </p>
            <ul className="grid gap-2">
              {PROMPTS.map((prompt, i) => (
                <li
                  key={prompt}
                  className="reveal"
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <Link
                    href={`/ai-assistant?q=${encodeURIComponent(prompt)}`}
                    className="group flex items-center justify-between gap-3 rounded-xl border bg-background px-4 py-3.5 transition-all hover:border-highlight/60 hover:bg-highlight-soft"
                  >
                    <span className="font-display text-xl">“{prompt}”</span>
                    <ArrowUpRightIcon className="size-4 shrink-0 text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-highlight" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
