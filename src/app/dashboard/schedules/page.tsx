import type { Metadata } from "next";
import { SchedulesTable } from "@/features/schedules/components/SchedulesTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "My Schedules" };

export default function SchedulesPage() {
  return <SchedulesTable />;
}
