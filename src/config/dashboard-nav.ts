import {
  BriefcaseMedicalIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  MailIcon,
  ReceiptIcon,
  SearchIcon,
  SparklesIcon,
  StethoscopeIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";
import type { Role } from "@/types/api";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboardIcon;
};

const overview: NavItem = {
  href: "/dashboard",
  label: "Overview",
  icon: LayoutDashboardIcon,
};
const profile: NavItem = {
  href: "/dashboard/profile",
  label: "Profile & Security",
  icon: UserCogIcon,
};

const patientNav: NavItem[] = [
  overview,
  {
    href: "/dashboard/appointments",
    label: "My Appointments",
    icon: CalendarDaysIcon,
  },
  { href: "/dashboard/payments", label: "Payments", icon: ReceiptIcon },
  { href: "/doctors", label: "Find Doctors", icon: SearchIcon },
  { href: "/ai-assistant", label: "AI Assistant", icon: SparklesIcon },
  profile,
];

const doctorNav: NavItem[] = [
  overview,
  {
    href: "/dashboard/schedules",
    label: "My Schedules",
    icon: CalendarClockIcon,
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: StethoscopeIcon,
  },
  profile,
];

const adminNav: NavItem[] = [
  overview,
  { href: "/dashboard/doctors", label: "Doctors", icon: BriefcaseMedicalIcon },
  { href: "/dashboard/users", label: "Users & Admins", icon: UsersIcon },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: CalendarDaysIcon,
  },
  { href: "/dashboard/payments", label: "Payments", icon: ReceiptIcon },
  { href: "/dashboard/messages", label: "Messages", icon: MailIcon },
  profile,
];

export const dashboardNav: Record<Role, NavItem[]> = {
  PATIENT: patientNav,
  DOCTOR: doctorNav,
  ADMIN: adminNav,
  SUPER_ADMIN: adminNav,
};

export const roleLabel: Record<Role, string> = {
  PATIENT: "Patient",
  DOCTOR: "Doctor",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};
