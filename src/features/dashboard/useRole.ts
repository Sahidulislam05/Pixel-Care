"use client";

import { useMe } from "@/features/auth/hooks";

/** Inside the dashboard the shell guarantees a signed-in user. */
export function useCurrentUser() {
  const { data } = useMe();
  if (!data)
    throw new Error("useCurrentUser must be used inside DashboardShell");
  return data;
}

export const isAdminRole = (role: string) =>
  role === "ADMIN" || role === "SUPER_ADMIN";
