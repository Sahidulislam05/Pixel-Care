import {
  BadgeCheckIcon,
  BriefcaseMedicalIcon,
  CalendarIcon,
  ChevronLeftIcon,
  GraduationCapIcon,
  IdCardIcon,
  MapPinIcon,
  WalletIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EcgLine } from "@/components/shared/EcgLine";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingPanel } from "@/features/appointments/components/BookingPanel";
import { DoctorAvatar } from "@/features/doctors/components/DoctorAvatar";
import {
  DOCTOR_GRID,
  DoctorCard,
} from "@/features/doctors/components/DoctorCard";
import { getPublicDoctor, getRelatedDoctors } from "@/features/doctors/queries";
import { formatDate, formatTaka } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/doctors/[doctorId]">): Promise<Metadata> {
  const { doctorId } = await params;
  const doctor = await getPublicDoctor(doctorId);
  if (!doctor) return { title: "Doctor not found" };
  return {
    title: `${doctor.name} — ${doctor.specialization}`,
    description: `${doctor.name}, ${doctor.qualifications}. ${doctor.experienceYears} years of experience. Book a video consultation on Pixel-Care.`,
  };
}

export default function DoctorDetailsPage({
  params,
}: PageProps<"/doctors/[doctorId]">) {
  return (
    <Suspense fallback={<DetailsSkeleton />}>
      <DoctorDetails params={params} />
    </Suspense>
  );
}

async function DoctorDetails({
  params,
}: {
  params: PageProps<"/doctors/[doctorId]">["params"];
}) {
  const { doctorId } = await params;
  const doctor = await getPublicDoctor(doctorId);
  if (!doctor) notFound();

  const related = await getRelatedDoctors(doctor.specialization, doctor.id);

  const facts = [
    {
      icon: GraduationCapIcon,
      label: "Qualifications",
      value: doctor.qualifications,
    },
    {
      icon: BriefcaseMedicalIcon,
      label: "Experience",
      value: `${doctor.experienceYears} years`,
    },
    {
      icon: WalletIcon,
      label: "Consultation fee",
      value: formatTaka(doctor.consultationFee),
    },
    {
      icon: MapPinIcon,
      label: "Location",
      value: doctor.address ?? "Not provided",
    },
    { icon: IdCardIcon, label: "BMDC licence", value: doctor.licenseNumber },
    {
      icon: CalendarIcon,
      label: "On Pixel-Care since",
      value: formatDate(doctor.createdAt),
    },
  ];

  return (
    <>
      <section className="grain relative -mt-24 overflow-hidden border-b pt-24">
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0"
        />
        <EcgLine className="pointer-events-none absolute inset-x-0 bottom-2 h-16 opacity-50" />
        <div className="container-page relative py-10 sm:py-14">
          <Link
            href="/doctors"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            <ChevronLeftIcon className="size-4" /> All doctors
          </Link>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <DoctorAvatar
              name={doctor.name}
              imageUrl={doctor.user?.imageUrl}
              className="animate-fade-up size-32 shrink-0 -rotate-2 rounded-xl shadow-xl ring-4 ring-card sm:size-44"
              textClassName="text-7xl"
              sizes="160px"
              priority
            />
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{doctor.specialization}</Badge>
                <Badge variant="success">
                  <BadgeCheckIcon /> Verified
                </Badge>
              </div>
              <h1 className="font-display text-5xl leading-none sm:text-6xl">
                {doctor.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {doctor.qualifications}
              </p>
              <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BriefcaseMedicalIcon className="size-4 text-primary" />{" "}
                  {doctor.experienceYears} years experience
                </span>
                {doctor.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4 text-primary" />{" "}
                    {doctor.address}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section
            aria-labelledby="overview-heading"
            className="rounded-xl border bg-card p-6"
          >
            <h2 id="overview-heading" className="font-display text-3xl">
              Overview
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {doctor.bio ??
                `${doctor.name} is a ${doctor.specialization.toLowerCase()} specialist on Pixel-Care.`}
            </p>
          </section>

          <section
            aria-labelledby="info-heading"
            className="rounded-xl border bg-card p-6"
          >
            <h2 id="info-heading" className="font-display text-3xl">
              Key information
            </h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex gap-3 rounded-xl bg-muted/60 p-4"
                >
                  <Icon
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 font-medium break-words">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section
            aria-labelledby="how-heading"
            className="rounded-xl border bg-card p-6"
          >
            <h2 id="how-heading" className="font-display text-3xl">
              How your consultation works
            </h2>
            <ol className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <li className="rounded-xl bg-accent/60 p-4">
                <span className="font-semibold text-accent-foreground">
                  1. Book & pay.
                </span>{" "}
                Choose today's schedule and pay with bKash.
              </li>
              <li className="rounded-xl bg-accent/60 p-4">
                <span className="font-semibold text-accent-foreground">
                  2. Get your time.
                </span>{" "}
                Your serial number and joining time are emailed with the meet
                link.
              </li>
              <li className="rounded-xl bg-accent/60 p-4">
                <span className="font-semibold text-accent-foreground">
                  3. Consult.
                </span>{" "}
                Join the video call; your prescription follows by email.
              </li>
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel doctorId={doctor.id} fee={doctor.consultationFee} />
        </aside>
      </div>

      {related.length > 0 && (
        <section
          className="container-page pb-16"
          aria-labelledby="related-heading"
        >
          <h2
            id="related-heading"
            className="font-display mb-8 text-4xl sm:text-5xl"
          >
            Other {doctor.specialization} specialists
          </h2>
          <div className={DOCTOR_GRID}>
            {related.map((item) => (
              <DoctorCard key={item.id} doctor={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function DetailsSkeleton() {
  return (
    <output
      className="container-page block space-y-8 py-12"
      aria-busy="true"
      aria-label="Loading doctor profile"
    >
      <div className="flex gap-6">
        <Skeleton className="size-40" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </output>
  );
}
