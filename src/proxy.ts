import { type NextRequest, NextResponse } from "next/server";
import type { Role } from "@/types/api";

/**
 * Optimistic route guard (no network calls). The API still authorises every
 * request; this only avoids rendering pages a visitor can't use.
 */

const ROLE_ROUTES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/dashboard/schedules", roles: ["DOCTOR"] },
  { prefix: "/dashboard/doctors", roles: ["ADMIN", "SUPER_ADMIN"] },
  { prefix: "/dashboard/users", roles: ["ADMIN", "SUPER_ADMIN"] },
  { prefix: "/dashboard/messages", roles: ["ADMIN", "SUPER_ADMIN"] },
  { prefix: "/dashboard/payments", roles: ["PATIENT", "ADMIN", "SUPER_ADMIN"] },
];

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

/** Reads the role claim without verifying the signature (the API verifies). */
function roleFromToken(token: string | undefined): Role | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (typeof json.exp === "number" && json.exp * 1000 < Date.now())
      return null;
    return (json.role as Role) ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const hasSession = Boolean(
    accessToken || request.cookies.get("refreshToken")?.value,
  );
  const role = roleFromToken(accessToken);

  if (pathname.startsWith("/dashboard")) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
    const rule = ROLE_ROUTES.find((r) => pathname.startsWith(r.prefix));
    if (rule && role && !rule.roles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if (AUTH_PAGES.includes(pathname) && role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/forgot-password"],
};
