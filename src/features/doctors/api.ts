import { api } from "@/lib/api-client";
import type { Doctor, Schedule } from "@/types/api";

export type DoctorListQuery = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  specialization?: string;
  minFee?: number;
  maxFee?: number;
  minExperience?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type DoctorWithSchedules = Doctor & { schedules: Schedule[] };

export const doctorsApi = {
  list: (query: DoctorListQuery) =>
    api<Doctor[]>("/doctor/public/all-doctors", { query }),
  availableToday: (query: DoctorListQuery) =>
    api<DoctorWithSchedules[]>("/doctor/public/available-today", { query }),
  todaysSchedules: (doctorId: string) =>
    api<Schedule[]>("/schedule/todays-schedule", {
      query: { doctorId, limit: 20 },
    }).then((r) => r.data),

  // admin
  adminList: (query: DoctorListQuery & { verificationStatus?: string }) =>
    api<Doctor[]>("/doctor/all-doctors", { query }),
  review: (body: {
    doctorId: string;
    verificationStatus: "APPROVED" | "REJECTED";
    rejectionReason?: string;
  }) => api<Doctor>("/doctor/approve-doctor", { method: "POST", body }),

  // doctor
  updateMyProfile: (body: {
    address?: string;
    bio?: string;
    consultationFee?: number;
    contactNumber?: string;
  }) => api<Doctor>("/doctor/update-my-profile", { method: "PATCH", body }),

  // public application
  apply: (form: FormData) =>
    api("/doctor/apply-as-doctor", { method: "POST", body: form }),
  verifyApplicationEmail: (body: { email: string; otp: string }) =>
    api("/doctor/apply-as-doctor/verify-email", { method: "POST", body }),
};
