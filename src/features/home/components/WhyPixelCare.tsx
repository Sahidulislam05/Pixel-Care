import {
  BadgeCheckIcon,
  FileCheck2Icon,
  LockKeyholeIcon,
  RotateCcwIcon,
  TimerIcon,
  VideoIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn } from "@/lib/utils";

// Bento layout: the two promises people worry about most get the large tiles.
const FEATURES = [
  {
    icon: BadgeCheckIcon,
    title: "Verified doctors only",
    text: "Every doctor applies with a BMDC licence and resume, and our team reviews each one before they can see patients.",
    className: "md:col-span-2 md:row-span-2 bg-primary text-primary-foreground",
    big: true,
  },
  {
    icon: LockKeyholeIcon,
    title: "Secure bKash checkout",
    text: "Official tokenized checkout. We never see your PIN.",
    className: "bg-card",
  },
  {
    icon: RotateCcwIcon,
    title: "Fair refunds",
    text: "Cancel over 1 hour before the schedule starts: automatic refund.",
    className: "bg-secondary text-secondary-foreground",
  },
  {
    icon: TimerIcon,
    title: "A real joining time",
    text: "Serial number plus a 20-minute slot. No waiting room.",
    className: "bg-card",
  },
  {
    icon: VideoIcon,
    title: "Consult from anywhere",
    text: "Phone or laptop, on the link your doctor shares.",
    className: "bg-highlight-soft",
  },
  {
    icon: FileCheck2Icon,
    title: "Records that stay with you",
    text: "Invoices and prescriptions arrive as PDFs and remain in your dashboard.",
    // Full width so the 4-column bento closes without an empty cell.
    className: "md:col-span-4 bg-card md:flex-row md:items-end",
  },
];

export function WhyPixelCare() {
  return (
    <section className="section bg-muted/50" aria-labelledby="why-heading">
      <div className="container-page">
        <SectionHeading
          id="why-heading"
          index="06"
          eyebrow="Why Pixel-Care"
          title={
            <>
              Built around <em>trust</em>, at every step
            </>
          }
          description="Healthcare needs more than convenience. These are the promises the platform is built on."
        />
        <ul className="grid auto-rows-[minmax(180px,auto)] gap-4 md:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text, className, big }, i) => (
            <li
              key={title}
              className={cn(
                "reveal group flex flex-col justify-between gap-6 rounded-xl border p-6 transition-transform duration-300 hover:-translate-y-1",
                className,
              )}
              style={{ "--i": i } as React.CSSProperties}
            >
              <Icon
                className={cn(
                  "transition-transform duration-500 group-hover:scale-110",
                  big ? "size-10" : "size-6",
                )}
              />
              <div>
                <h3
                  className={cn(
                    "font-display",
                    big ? "text-4xl sm:text-5xl" : "text-2xl",
                  )}
                >
                  {title}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed opacity-80",
                    big && "max-w-md text-base",
                  )}
                >
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
