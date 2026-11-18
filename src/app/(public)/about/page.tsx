import {
  BotIcon,
  HeartHandshakeIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  UsersIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Why Pixel-Care exists and how we keep online consultations safe and simple.",
};

const VALUES = [
  {
    icon: ShieldCheckIcon,
    title: "Safety first",
    text: "Doctors are verified by licence and resume before they can see patients. Payments go through bKash only.",
  },
  {
    icon: HeartHandshakeIcon,
    title: "Respect for time",
    text: "Serial numbers and fixed joining times replace crowded waiting rooms and uncertain queues.",
  },
  {
    icon: BotIcon,
    title: "Honest technology",
    text: "Our AI assistant recommends real doctors from our data. It never pretends to be one.",
  },
];

const ROLES = [
  {
    icon: UsersIcon,
    title: "Patients",
    text: "Find a specialist, book today's slot, pay with bKash, consult by video and keep every record.",
  },
  {
    icon: StethoscopeIcon,
    title: "Doctors",
    text: "Publish daily schedules, manage consultations and write digital prescriptions in minutes.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Admins",
    text: "Review doctor applications, manage users and keep an eye on appointments and payments.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Pixel-Care"
        title={
          <>
            Healthcare that fits <em>into your day</em>
          </>
        }
        description="Pixel-Care connects patients across Bangladesh with verified doctors for same-day video consultations: no travel, no queues, and a clear record of every visit."
      />

      <section className="section container-page">
        <SectionHeading
          index="01"
          eyebrow="Our values"
          title={
            <>
              What we <em>stand for</em>
            </>
          }
        />
        <ul className="grid gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="reveal group bg-card p-8"
              style={{ "--i": i } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-6xl text-primary/25 italic">
                  0{i + 1}
                </span>
                <Icon className="size-6 text-primary transition-transform duration-500 group-hover:rotate-12" />
              </div>
              <h3 className="font-display mt-8 text-3xl">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section bg-card">
        <div className="container-page">
          <SectionHeading
            index="02"
            eyebrow="One platform"
            title={
              <>
                Designed for <em>everyone</em> in the consultation
              </>
            }
          />
          <ul className="grid gap-6 md:grid-cols-3">
            {ROLES.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                className="reveal rounded-xl border bg-background p-6 transition-transform hover:-translate-y-1"
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  <Icon className="size-4 text-primary" /> Role
                </span>
                <h3 className="font-display mt-4 text-4xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section container-page text-center">
        <h2 className="font-display text-5xl sm:text-6xl">
          Ready <em className="text-highlight">when you are</em>
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Find a doctor now, or join our network as a specialist.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/doctors" className={buttonVariants({ size: "lg" })}>
            Find a doctor
          </Link>
          <Link
            href="/apply-as-doctor"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            Join as a doctor
          </Link>
        </div>
      </section>
    </>
  );
}
