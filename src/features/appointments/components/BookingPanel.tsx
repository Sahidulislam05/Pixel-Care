"use client";

import { useMutation } from "@tanstack/react-query";
import {
  CalendarClockIcon,
  ClockIcon,
  LogInIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ErrorState } from "@/components/shared/States";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/features/auth/hooks";
import { useTodaysSchedules } from "@/features/doctors/hooks";
import { getErrorMessage } from "@/lib/api-client";
import { formatTaka, formatTime } from "@/lib/format";
import { appointmentsApi } from "../api";

type BookingPanelProps = { doctorId: string; fee: string | null };

/** Today's bookable schedules for a doctor. Booking hands off to bKash checkout. */
export function BookingPanel({ doctorId, fee }: BookingPanelProps) {
  const { data: me, isLoading: isMeLoading } = useMe();
  const schedules = useTodaysSchedules(doctorId);

  const book = useMutation({
    mutationFn: appointmentsApi.book,
    onSuccess: ({ data }) => {
      toast.success("Redirecting you to bKash to complete payment…");
      window.location.assign(data.paymentUrl);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const isPatient = me?.role === "PATIENT";

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">Book a consultation</h2>
        <p className="text-2xl font-bold text-primary">{formatTaka(fee)}</p>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Video consultation · 20-minute slot · paid via bKash
      </p>

      <h3 className="mt-6 mb-3 flex items-center gap-2 text-sm font-semibold">
        <CalendarClockIcon className="size-4 text-primary" /> Today's schedules
      </h3>

      {schedules.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : schedules.isError ? (
        <ErrorState
          message={schedules.error.message}
          onRetry={() => schedules.refetch()}
        />
      ) : !schedules.data?.length ? (
        <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
          No open schedule today. Doctors publish schedules on the day, so
          please check back later or see{" "}
          <Link
            href="/doctors?available=today"
            className="font-medium text-primary hover:underline"
          >
            who's available now
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-3">
          {schedules.data.map((schedule) => (
            <li key={schedule.id} className="rounded-xl border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 font-medium">
                    <ClockIcon className="size-4 text-primary" />
                    {formatTime(schedule.startDateTime)} –{" "}
                    {formatTime(schedule.endDateTime)}
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-secondary-foreground">
                    <UsersIcon className="size-4" /> {schedule.availableSlots}{" "}
                    of {schedule.totalSlots} slots left
                  </p>
                </div>
                {isPatient && (
                  <Button
                    onClick={() => book.mutate(schedule.id)}
                    disabled={book.isPending}
                    aria-busy={book.isPending && book.variables === schedule.id}
                  >
                    {book.isPending && book.variables === schedule.id
                      ? "Starting payment…"
                      : "Book & pay"}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isMeLoading && !me && (
        <Link
          href={`/login?next=${encodeURIComponent(`/doctors/${doctorId}`)}`}
          className={buttonVariants({ className: "mt-5 w-full" })}
        >
          <LogInIcon /> Sign in to book
        </Link>
      )}
      {me && !isPatient && (
        <p className="mt-5 rounded-xl bg-muted p-3 text-sm text-muted-foreground">
          You're signed in as a {me.role.toLowerCase().replace("_", " ")}. Only
          patient accounts can book appointments.
        </p>
      )}
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
        Cancel more than 1 hour before the schedule starts for an automatic
        refund.
      </p>
    </div>
  );
}
