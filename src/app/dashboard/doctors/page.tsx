import type { Metadata } from "next";
import { AdminDoctorsTable } from "@/features/doctors/components/AdminDoctorsTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Doctors" };

export default function AdminDoctorsPage() {
  return <AdminDoctorsTable />;
}
