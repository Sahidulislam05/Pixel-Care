"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { type ReactNode, useSyncExternalStore } from "react";
import { meQueryOptions } from "@/features/auth/hooks";

const noopSubscribe = () => () => {};

/**
 * Renders dashboard pages only once the signed-in user is known.
 * The session lives in browser cookies, so on the server (and during hydration,
 * to keep markup identical) this renders `fallback`; in the browser it suspends
 * on the session query and the nearest <Suspense> shows the same fallback.
 */
export function RequireUser({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const isBrowser = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  if (!isBrowser) return fallback;
  return <SessionGate>{children}</SessionGate>;
}

function SessionGate({ children }: { children: ReactNode }) {
  const { data: me } = useSuspenseQuery(meQueryOptions);
  // Signed out: DashboardShell redirects to /login; render nothing meanwhile.
  return me ? children : null;
}
