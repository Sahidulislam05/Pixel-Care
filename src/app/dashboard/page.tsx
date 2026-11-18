import type { Metadata } from "next";
import { Overview } from "@/features/dashboard/components/Overview";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Overview" };

export default function DashboardPage() {
  return <Overview />;
}
