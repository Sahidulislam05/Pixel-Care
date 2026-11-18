import {
  ArrowUpRightIcon,
  BriefcaseMedicalIcon,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cityOf, formatTaka } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Doctor } from "@/types/api";
import { DoctorAvatar } from "./DoctorAvatar";

type DoctorCardProps = {
  doctor: Doctor;
  availableSlots?: number;
  priority?: boolean;
};

/** Equal-height card: image, title, short description, meta, "View details". */
export function DoctorCard({
  doctor,
  availableSlots,
  priority,
}: DoctorCardProps) {
  const city = cityOf(doctor.address);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10">
      <div className="relative overflow-hidden">
        <DoctorAvatar
          name={doctor.name}
          imageUrl={doctor.user?.imageUrl}
          className="aspect-4/3 w-full transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
        />
        <div
          aria-hidden="true"
          className="bg-dots pointer-events-none absolute inset-0 opacity-40"
        />
        {availableSlots !== undefined && (
          <Badge
            variant="success"
            className="absolute top-3 left-3 font-mono shadow-sm"
          >
            <span
              className="size-1.5 animate-pulse rounded-full bg-current"
              aria-hidden="true"
            />
            {availableSlots} SLOTS TODAY
          </Badge>
        )}
        <span className="absolute right-3 bottom-3 rounded-lg bg-card/90 px-2.5 py-1 font-mono text-sm font-semibold shadow-sm backdrop-blur">
          <span className="sr-only">Consultation fee </span>
          {formatTaka(doctor.consultationFee)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-xs tracking-wider text-primary uppercase">
          {doctor.specialization}
        </p>
        <div>
          <h3 className="font-display line-clamp-1 text-2xl leading-tight">
            {doctor.name}
          </h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">
            {doctor.qualifications}
          </p>
        </div>

        <p className="line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
          {doctor.bio ?? `${doctor.specialization} specialist on Pixel-Care.`}
        </p>

        <dl className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t pt-3 text-sm">
          <div className="flex items-center gap-1.5">
            <BriefcaseMedicalIcon
              className="size-4 text-primary"
              aria-hidden="true"
            />
            <dt className="sr-only">Experience</dt>
            <dd>{doctor.experienceYears} yrs</dd>
          </div>
          {city && (
            <div className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" aria-hidden="true" />
              <dt className="sr-only">Location</dt>
              <dd className="truncate">{city}</dd>
            </div>
          )}
        </dl>

        <Link
          href={`/doctors/${doctor.id}`}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-auto w-full justify-between transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background",
          )}
          aria-label={`View details for ${doctor.name}`}
        >
          View details{" "}
          <ArrowUpRightIcon className="transition-transform duration-300 group-hover:rotate-45" />
        </Link>
      </div>
    </article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div
      className="flex h-full flex-col overflow-hidden rounded-xl border bg-card"
      aria-hidden="true"
    >
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-auto h-10 w-full" />
      </div>
    </div>
  );
}

export const DOCTOR_GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-4";
