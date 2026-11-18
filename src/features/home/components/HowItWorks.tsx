import {
  CalendarCheckIcon,
  FileTextIcon,
  SearchIcon,
  VideoIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const STEPS = [
  {
    icon: SearchIcon,
    title: "Find your doctor",
    text: "Filter by speciality, fee and experience, or just describe how you feel to the AI assistant.",
  },
  {
    icon: CalendarCheckIcon,
    title: "Book & pay",
    text: "Pick an open slot on today's schedule and pay with bKash. You get a serial number and joining time.",
  },
  {
    icon: VideoIcon,
    title: "Join the call",
    text: "The meeting link is in your invoice email. Each consultation slot is 20 focused minutes.",
  },
  {
    icon: FileTextIcon,
    title: "Get your prescription",
    text: "Your doctor's prescription arrives as a PDF and stays in your dashboard for later.",
  },
];

export function HowItWorks() {
  return (
    <section
      className="section relative bg-foreground text-background"
      aria-labelledby="how-heading"
    >
      <div className="container-page">
        <SectionHeading
          id="how-heading"
          index="03"
          eyebrow="How it works"
          title={
            <>
              From symptom to prescription, <em>in four steps</em>
            </>
          }
          // Inverted band: a lighter coral on ink (light mode), a deeper coral on paper (dark mode).
          className="[&_p]:text-background/60 [&_h2_em]:text-[oklch(0.8_0.12_45)] dark:[&_h2_em]:text-[oklch(0.5_0.16_38)]"
        />

        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">
          {/* Connector that draws itself as the timeline scrolls into view. */}
          <span
            aria-hidden="true"
            className="reveal-line absolute top-6 right-[12%] left-[12%] hidden h-px bg-background/25 md:block"
          />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="reveal relative"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <span className="relative z-10 flex size-12 items-center justify-center rounded-xl bg-background text-foreground shadow-lg ring-4 ring-foreground">
                  <Icon className="size-5" />
                </span>
                <span className="font-mono text-sm text-background/50">
                  STEP 0{i + 1}
                </span>
              </div>
              <h3 className="font-display mt-5 text-3xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/65">
                {text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
