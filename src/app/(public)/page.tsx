import Link from "next/link";
import { Suspense } from "react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { FaqList } from "@/components/shared/FaqList";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { FAQ_ITEMS } from "@/config/faq";
import {
  DOCTOR_GRID,
  DoctorCardSkeleton,
} from "@/features/doctors/components/DoctorCard";
import { AiAssistantShowcase } from "@/features/home/components/AiAssistantShowcase";
import { CallToAction } from "@/features/home/components/CallToAction";
import {
  AvailableTodayRail,
  ExperiencedDoctorsRail,
} from "@/features/home/components/DoctorRail";
import { Hero } from "@/features/home/components/Hero";
import { HowItWorks } from "@/features/home/components/HowItWorks";
import { Specializations } from "@/features/home/components/Specializations";
import { WhyPixelCare } from "@/features/home/components/WhyPixelCare";

const RailFallback = () => (
  <div className={DOCTOR_GRID}>
    {Array.from({ length: 4 }, (_, i) => (
      <DoctorCardSkeleton key={i} />
    ))}
  </div>
);

export default function HomePage() {
  return (
    <>
      <Hero />
      <Specializations />

      <section
        className="section border-y bg-card"
        aria-labelledby="today-heading"
      >
        <div className="container-page">
          <SectionHeading
            id="today-heading"
            index="02"
            eyebrow="Available today"
            title={
              <>
                Open slots, <em>right now</em>
              </>
            }
            description="Live from today's published schedules. Book before the schedule starts."
            action={
              <ArrowLink href="/doctors?available=today">
                Everyone available
              </ArrowLink>
            }
          />
          <Suspense fallback={<RailFallback />}>
            <AvailableTodayRail />
          </Suspense>
        </div>
      </section>

      <HowItWorks />

      <section
        className="section container-page"
        aria-labelledby="experienced-heading"
      >
        <SectionHeading
          id="experienced-heading"
          index="04"
          eyebrow="Senior specialists"
          title={
            <>
              Decades of practice, <em>one call away</em>
            </>
          }
          description="Our most experienced doctors across every speciality."
          action={
            <ArrowLink href="/doctors?sort=experience">
              Browse all doctors
            </ArrowLink>
          }
        />
        <Suspense fallback={<RailFallback />}>
          <ExperiencedDoctorsRail />
        </Suspense>
      </section>

      <AiAssistantShowcase />
      <WhyPixelCare />

      <section className="section container-page" aria-labelledby="faq-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeading
            id="faq-heading"
            index="07"
            eyebrow="FAQ"
            title={
              <>
                Questions, <em>answered</em>
              </>
            }
            description={
              <>
                Booking, payments, refunds and prescriptions, explained. Still
                unsure?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Contact us
                </Link>
                .
              </>
            }
            className="mb-0 lg:flex-col lg:items-start"
          />
          <FaqList items={FAQ_ITEMS.slice(0, 5)} />
        </div>
      </section>

      <CallToAction />
    </>
  );
}
