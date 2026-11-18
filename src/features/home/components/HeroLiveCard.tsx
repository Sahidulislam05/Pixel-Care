"use client";

import { ArrowRightIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { DoctorAvatar } from "@/features/doctors/components/DoctorAvatar";
import { useAvailableToday, useDoctors } from "@/features/doctors/hooks";
import { formatTaka, formatTime } from "@/lib/format";
import { CountUp } from "./CountUp";

/** Live panel: real platform numbers and the next doctors with open slots today. */
export function HeroLiveCard() {
  const totalDoctors = useDoctors({ limit: 1 });
  const today = useAvailableToday({
    limit: 3,
    sortBy: "experienceYears",
    sortOrder: "desc",
  });
  const todayDoctors = today.data?.data ?? [];

  return (
    <div className="relative">
      <div className="rotate-1 rounded-xl border bg-card p-5 shadow-2xl shadow-primary/15 transition-transform duration-500 hover:rotate-0 sm:p-6">
        <div className="mb-4 flex items-center justify-between border-b pb-3 font-mono text-xs tracking-wider text-muted-foreground uppercase">
          <span>Pixel-Care · Today</span>
          <span className="flex items-center gap-1.5 text-secondary-foreground">
            <span className="size-1.5 animate-pulse rounded-full bg-current" />{" "}
            Live
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-accent p-4">
            <div className="font-mono text-4xl font-semibold tracking-tight text-accent-foreground">
              {totalDoctors.data?.meta ? (
                <CountUp value={totalDoctors.data.meta.total} />
              ) : (
                <Skeleton className="h-9 w-16" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Verified doctors
            </p>
          </div>
          <div className="rounded-xl bg-secondary p-4">
            <div className="font-mono text-4xl font-semibold tracking-tight text-secondary-foreground">
              {today.data?.meta ? (
                <CountUp value={today.data.meta.total} />
              ) : (
                <Skeleton className="h-9 w-12" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Available today
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-secondary-foreground/60" />
              <span className="relative inline-flex size-2 rounded-full bg-secondary-foreground" />
            </span>
            Open slots right now
          </h2>
          <Link
            href="/doctors?available=today"
            className="text-sm font-medium text-primary hover:underline"
          >
            See all
          </Link>
        </div>

        <ul className="mt-3 space-y-2">
          {today.isLoading &&
            Array.from({ length: 3 }, (_, i) => (
              <li key={i}>
                <Skeleton className="h-16 w-full" />
              </li>
            ))}
          {!today.isLoading && todayDoctors.length === 0 && (
            <li className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
              Today's slots are fully booked. New schedules are published every
              morning, so browse doctors and check back soon.
            </li>
          )}
          {todayDoctors.map((doctor) => {
            const next = doctor.schedules[0];
            return (
              <li key={doctor.id}>
                <Link
                  href={`/doctors/${doctor.id}`}
                  className="group flex items-center gap-3 rounded-xl border p-3 transition-all hover:translate-x-1 hover:border-primary/40 hover:bg-accent/50"
                >
                  <DoctorAvatar
                    name={doctor.name}
                    imageUrl={doctor.user?.imageUrl}
                    className="size-11 shrink-0 rounded-xl"
                    textClassName="text-sm"
                    sizes="44px"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{doctor.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {doctor.specialization} ·{" "}
                      {formatTaka(doctor.consultationFee)}
                    </p>
                  </div>
                  {next && (
                    <span className="flex shrink-0 items-center gap-1 rounded-sm bg-highlight-soft px-2 py-1 font-mono text-xs font-medium text-highlight">
                      <ClockIcon className="size-3" />{" "}
                      {formatTime(next.startDateTime)}
                    </span>
                  )}
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
