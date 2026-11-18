import type { Metadata } from "next";
import { ProfilePage } from "@/features/users/components/ProfilePage";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Profile & Security" };

export default function DashboardProfilePage() {
  return <ProfilePage />;
}
