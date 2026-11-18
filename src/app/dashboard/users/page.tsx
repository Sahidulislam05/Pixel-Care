import type { Metadata } from "next";
import { UsersTable } from "@/features/users/components/UsersTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Users & Admins" };

export default function UsersPage() {
  return <UsersTable />;
}
