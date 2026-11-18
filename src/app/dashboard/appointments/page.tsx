import type { Metadata } from "next";
import { AppointmentsTable } from "@/features/appointments/components/AppointmentsTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Appointments" };

export default function AppointmentsPage() {
  return <AppointmentsTable />;
}
