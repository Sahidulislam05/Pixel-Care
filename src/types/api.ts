export type Meta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Meta;
};

export type Paginated<T> = {
  data: T[];
  meta: Meta;
};

export type Role = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";
export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";
export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";
export type ScheduleStatus = "DRAFT" | "PUBLISHED";
export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  authProvider: "GOOGLE" | "CREDENTIAL";
  emailVerified: boolean;
  needPasswordChange: boolean;
  imageUrl: string;
  createdAt: string;
};

export type Patient = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
};

export type Doctor = {
  id: string;
  name: string;
  email?: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio: string | null;
  consultationFee: string | null;
  address: string | null;
  contactNumber?: string | null;
  verificationStatus?: DoctorVerificationStatus;
  rejectionReason?: string | null;
  resume?: string | null;
  createdAt: string;
  user?: { imageUrl: string } | (User & { imageUrl: string });
};

export type Me = User & { patient: Patient | null; doctor: Doctor | null };

export type Schedule = {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink: string;
  status: ScheduleStatus;
  doctorId: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  status: PaymentStatus;
  amount: string;
  currency: string;
  bkashTrxId: string | null;
  paidAt: string | null;
  refundAmount: string | null;
  refundedAt: string | null;
  createdAt: string;
  appointment?: Appointment;
};

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  serialNumber: number | null;
  joiningTime: string | null;
  prescriptionUrl: string | null;
  createdAt: string;
  schedule: Schedule;
  doctor?: Pick<Doctor, "id" | "name" | "specialization">;
  patient?: Pick<Patient, "id" | "name" | "email"> & {
    contactNumber?: string | null;
  };
  payment?: Payment | null;
};

export type ChartData = {
  appointmentsByStatus: { status: AppointmentStatus; count: number }[];
  monthlyTrend: { month: string; appointments: number; revenue: number }[];
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};
