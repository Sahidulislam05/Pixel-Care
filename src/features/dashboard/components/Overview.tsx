"use client";

import {
  BanknoteIcon,
  CalendarCheckIcon,
  CalendarClockIcon,
  CalendarXIcon,
  CircleCheckBigIcon,
  ClipboardListIcon,
  HourglassIcon,
  RotateCcwIcon,
  StethoscopeIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";
import Link from "next/link";
import { ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type AdminAnalytics,
  type DoctorAnalytics,
  type PatientAnalytics,
  useAnalytics,
} from "@/features/analytics/api";
import {
  AppointmentsBarChart,
  ChartCard,
  RevenueLineChart,
  StatusPieChart,
} from "@/features/analytics/components/Charts";
import {
  StatCard,
  StatGridSkeleton,
} from "@/features/analytics/components/StatCard";
import { useAppointments } from "@/features/appointments/hooks";
import { formatDateTime, formatTaka } from "@/lib/format";
import type { ChartData, Role } from "@/types/api";
import { isAdminRole, useCurrentUser } from "../useRole";

function ChartsRow({
  charts,
  revenueLabel,
}: {
  charts: ChartData;
  revenueLabel: string;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartCard title="Appointments per month" description="Last 6 months">
        <AppointmentsBarChart data={charts.monthlyTrend} />
      </ChartCard>
      <ChartCard
        title={revenueLabel}
        description="Paid bookings, last 6 months"
      >
        <RevenueLineChart data={charts.monthlyTrend} label={revenueLabel} />
      </ChartCard>
      <ChartCard title="Appointments by status" description="All time">
        <StatusPieChart data={charts.appointmentsByStatus} />
      </ChartCard>
    </div>
  );
}

function RecentAppointments({ role }: { role: Role }) {
  const scope =
    role === "PATIENT" ? "patient" : role === "DOCTOR" ? "doctor" : "admin";
  const { data, isLoading } = useAppointments(scope, {
    limit: 5,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  return (
    <section className="rounded-xl border bg-card p-5 shadow-xs">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl">Recent appointments</h2>
        <Link
          href="/dashboard/appointments"
          className="text-sm font-medium text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No appointments yet.{" "}
          {role === "PATIENT" && (
            <Link
              href="/doctors"
              className="font-medium text-primary hover:underline"
            >
              Find a doctor
            </Link>
          )}
        </p>
      ) : (
        <ul className="divide-y">
          {data.data.map((appointment) => (
            <li
              key={appointment.id}
              className="flex flex-wrap items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {role === "DOCTOR"
                    ? appointment.patient?.name
                    : appointment.doctor?.name}
                  {isAdminRole(role) && appointment.patient && (
                    <span className="font-normal text-muted-foreground">
                      {" "}
                      · {appointment.patient.name}
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(
                    appointment.joiningTime ??
                      appointment.schedule.startDateTime,
                  )}
                </p>
              </div>
              <StatusBadge status={appointment.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PatientOverview() {
  const { data, isLoading, isError, error, refetch } =
    useAnalytics<PatientAnalytics>("PATIENT");
  if (isError)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  return (
    <>
      {isLoading || !data ? (
        <StatGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Upcoming"
            value={data.upcomingAppointments}
            icon={CalendarClockIcon}
            hint="Confirmed, not started"
          />
          <StatCard
            label="Completed"
            value={data.completedAppointments}
            icon={CircleCheckBigIcon}
            tone="secondary"
          />
          <StatCard
            label="Total spent"
            value={formatTaka(data.totalAmountSpent)}
            icon={WalletIcon}
            tone="highlight"
          />
          <StatCard
            label="Refunded"
            value={formatTaka(data.totalRefunded)}
            icon={RotateCcwIcon}
            tone="neutral"
          />
        </div>
      )}
      {data && <ChartsRow charts={data.charts} revenueLabel="Amount spent" />}
    </>
  );
}

function DoctorOverview() {
  const { data, isLoading, isError, error, refetch } =
    useAnalytics<DoctorAnalytics>("DOCTOR");
  if (isError)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  return (
    <>
      {isLoading || !data ? (
        <StatGridSkeleton />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Upcoming consultations"
            value={data.upcomingAppointments}
            icon={CalendarClockIcon}
            hint={`${data.ongoingAppointments} in progress`}
          />
          <StatCard
            label="Completed"
            value={data.completedAppointments}
            icon={CircleCheckBigIcon}
            tone="secondary"
          />
          <StatCard
            label="Earnings"
            value={formatTaka(data.totalDoctorEarnings)}
            icon={BanknoteIcon}
            tone="highlight"
            hint={`${formatTaka(data.totalDoctorRefunded)} refunded`}
          />
          <StatCard
            label="Published schedules"
            value={`${data.publishedSchedules}/${data.totalSchedules}`}
            icon={ClipboardListIcon}
            tone="neutral"
          />
        </div>
      )}
      {data && <ChartsRow charts={data.charts} revenueLabel="Earnings" />}
    </>
  );
}

function AdminOverview() {
  const { data, isLoading, isError, error, refetch } =
    useAnalytics<AdminAnalytics>("ADMIN");
  if (isError)
    return <ErrorState message={error.message} onRetry={() => refetch()} />;
  return (
    <>
      {isLoading || !data ? (
        <StatGridSkeleton count={8} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Revenue"
            value={formatTaka(data.totalRevenue)}
            icon={BanknoteIcon}
            tone="highlight"
            hint={`${formatTaka(data.totalRefunded)} refunded`}
          />
          <StatCard
            label="Patients"
            value={data.totalPatients}
            icon={UsersIcon}
          />
          <StatCard
            label="Approved doctors"
            value={data.totalApprovedDoctors}
            icon={StethoscopeIcon}
            tone="secondary"
          />
          <StatCard
            label="Pending applications"
            value={data.totalPendingDoctorApplications}
            icon={HourglassIcon}
            tone="highlight"
            hint={`${data.totalRejectedDoctors} rejected`}
          />
          <StatCard
            label="Appointments"
            value={data.totalAppointments}
            icon={CalendarCheckIcon}
          />
          <StatCard
            label="Completed"
            value={data.totalCompletedAppointments}
            icon={CircleCheckBigIcon}
            tone="secondary"
          />
          <StatCard
            label="Cancelled"
            value={data.totalCancelledAppointments}
            icon={CalendarXIcon}
            tone="neutral"
          />
          <StatCard
            label="All doctors"
            value={data.totalDoctors}
            icon={ClipboardListIcon}
            tone="neutral"
          />
        </div>
      )}
      {data && <ChartsRow charts={data.charts} revenueLabel="Revenue" />}
    </>
  );
}

export function Overview() {
  const me = useCurrentUser();
  const firstName = me.name.replace(/^Dr\.?\s+/i, "").split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Overview
        </p>
        <h2 className="font-display mt-1 text-4xl sm:text-5xl">
          Good to see you, <em className="text-highlight">{firstName}.</em>
        </h2>
        <p className="text-muted-foreground">
          {me.role === "PATIENT" &&
            "Here's an overview of your consultations and payments."}
          {me.role === "DOCTOR" && "Here's how your practice is doing."}
          {isAdminRole(me.role) && "Platform activity at a glance."}
        </p>
      </div>
      {me.role === "PATIENT" && <PatientOverview />}
      {me.role === "DOCTOR" && <DoctorOverview />}
      {isAdminRole(me.role) && <AdminOverview />}
      <RecentAppointments role={me.role} />
    </div>
  );
}
