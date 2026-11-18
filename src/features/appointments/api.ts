import { api } from "@/lib/api-client";
import type { Appointment, AppointmentStatus, Payment } from "@/types/api";

export type AppointmentListQuery = {
  page?: number;
  limit?: number;
  status?: AppointmentStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  patientEmail?: string;
  doctorEmail?: string;
};

export type ListScope = "patient" | "doctor" | "admin";

const LIST_PATH: Record<ListScope, string> = {
  patient: "/appointment/my-appointments",
  doctor: "/appointment/doctor-appointments",
  admin: "/appointment/all-appointments",
};

export const appointmentsApi = {
  book: (scheduleId: string) =>
    api<{ appointmentId: string; paymentUrl: string }>(
      "/appointment/book-appointment",
      {
        method: "POST",
        body: { scheduleId },
      },
    ),
  pay: (appointmentId: string) =>
    api<{ paymentUrl: string }>("/appointment/pay-appointment", {
      method: "POST",
      body: { appointmentId },
    }),
  cancel: (appointmentId: string) =>
    api<{ refunded: boolean }>("/appointment/cancel-appointment", {
      method: "POST",
      body: { appointmentId },
    }),
  updateStatus: (appointmentId: string, status: "ONGOING" | "COMPLETED") =>
    api<Appointment>(`/appointment/update-status/${appointmentId}`, {
      method: "PATCH",
      body: { status },
    }),
  list: (scope: ListScope, query: AppointmentListQuery) =>
    api<Appointment[]>(LIST_PATH[scope], { query }),

  createPrescription: (body: {
    appointmentId: string;
    findings: string;
    medicines: {
      name: string;
      dosage: string;
      duration: string;
      instructions?: string;
    }[];
  }) =>
    api<Appointment>("/prescription/create-prescription", {
      method: "POST",
      body,
    }),

  payments: (
    scope: "patient" | "admin",
    query: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      patientEmail?: string;
    },
  ) =>
    api<Payment[]>(
      scope === "patient" ? "/payment/my-payments" : "/payment/all-payments",
      { query },
    ),
};
