"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ChartData, Role } from "@/types/api";

export type AdminAnalytics = {
  totalDoctors: number;
  totalPendingDoctorApplications: number;
  totalApprovedDoctors: number;
  totalRejectedDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalCompletedAppointments: number;
  totalCancelledAppointments: number;
  totalRevenue: number;
  totalRefunded: number;
  charts: ChartData;
};

export type DoctorAnalytics = {
  totalSchedules: number;
  publishedSchedules: number;
  totalAppointments: number;
  upcomingAppointments: number;
  ongoingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctorEarnings: number;
  totalDoctorRefunded: number;
  charts: ChartData;
};

export type PatientAnalytics = {
  totalAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalAmountSpent: number;
  totalRefunded: number;
  charts: ChartData;
};

const PATHS = {
  PATIENT: "/analytics/patient-analytics",
  DOCTOR: "/analytics/doctor-analytics",
  ADMIN: "/analytics/admin-analytics",
  SUPER_ADMIN: "/analytics/admin-analytics",
} as const satisfies Record<Role, string>;

export function useAnalytics<T>(role: Role) {
  return useQuery({
    queryKey: ["analytics", role],
    queryFn: () => api<T>(PATHS[role]).then((r) => r.data),
  });
}
