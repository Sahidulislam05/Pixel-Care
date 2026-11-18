"use client";

import Link from "next/link";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { buttonVariants } from "@/components/ui/button";
import {
  DOCTOR_GRID,
  DoctorCard,
  DoctorCardSkeleton,
} from "@/features/doctors/components/DoctorCard";
import { useAvailableToday, useDoctors } from "@/features/doctors/hooks";

const Skeletons = () => (
  <div className={DOCTOR_GRID}>
    {Array.from({ length: 4 }, (_, i) => (
      <DoctorCardSkeleton key={i} />
    ))}
  </div>
);

export function AvailableTodayRail() {
  const { data, isLoading, isError, error, refetch } = useAvailableToday({
    limit: 4,
    sortBy: "experienceYears",
    sortOrder: "desc",
  });
  if (isLoading) return <Skeletons />;
  if (isError)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  if (!data?.data.length)
    return (
      <EmptyState
        title="All of today's slots are taken"
        description="Doctors publish new schedules every day. Meanwhile, explore specialists and their profiles."
        action={
          <Link
            href="/doctors"
            className={buttonVariants({ variant: "outline" })}
          >
            Browse doctors
          </Link>
        }
      />
    );
  return (
    <div className={DOCTOR_GRID}>
      {data.data.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          availableSlots={doctor.schedules.reduce(
            (sum, s) => sum + s.availableSlots,
            0,
          )}
        />
      ))}
    </div>
  );
}

export function ExperiencedDoctorsRail() {
  const { data, isLoading, isError, error, refetch } = useDoctors({
    limit: 4,
    sortBy: "experienceYears",
    sortOrder: "desc",
  });
  if (isLoading) return <Skeletons />;
  if (isError)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  return (
    <div className={DOCTOR_GRID}>
      {data?.data.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
