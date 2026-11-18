import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardShell } from "@/features/dashboard/components/DashboardShell";

// The dashboard is session-gated and renders from client-side data, so its pages
// are not expected to navigate instantly from a prerendered shell.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard · Pixel-Care" },
  robots: { index: false },
};

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <Suspense
      fallback={<Skeleton className="min-h-screen w-full rounded-none" />}
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
