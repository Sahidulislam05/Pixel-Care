import type { Metadata } from "next";
import { PaymentsTable } from "@/features/appointments/components/PaymentsTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Payments" };

export default function PaymentsPage() {
  return <PaymentsTable />;
}
