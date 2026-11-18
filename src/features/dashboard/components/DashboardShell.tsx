"use client";

import { ExternalLinkIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, Suspense, useEffect, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardNav, type NavItem, roleLabel } from "@/config/dashboard-nav";
import { useLogout, useMe } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { RequireUser } from "./RequireUser";

const isActive = (pathname: string, href: string) =>
  href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

function SidebarNav({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="grid gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        const isExternal = !href.startsWith("/dashboard");
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4.5" />
              <span className="flex-1">{label}</span>
              {isExternal && (
                <ExternalLinkIcon className="size-3.5 opacity-50" />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function NavSkeleton() {
  return (
    <div className="grid gap-2">
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <Skeleton className="h-12 w-72" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-80" />
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: me, isLoading } = useMe();
  const logout = useLogout();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Session expired or cookie removed: send to login, then back here.
  useEffect(() => {
    if (!isLoading && me === null)
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [isLoading, me, pathname, router]);

  // The chrome renders immediately; user-dependent bits show skeletons until the
  // session is known. Page content always renders (inside RequireUser + Suspense).
  const items = me ? dashboardNav[me.role] : [];
  const current = items.find((item) => isActive(pathname, item.href));

  const sidebarFooter = (
    <div className="space-y-3 border-t p-4">
      {me ? (
        <p className="rounded-xl bg-sidebar-accent px-3 py-2 text-xs text-sidebar-accent-foreground">
          Signed in as <strong>{roleLabel[me.role]}</strong>
        </p>
      ) : (
        <Skeleton className="h-8 w-full" />
      )}
      <Button
        variant="ghost"
        className="w-full justify-start text-destructive hover:text-destructive"
        onClick={() => logout.mutate()}
      >
        <LogOutIcon /> Sign out
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar lg:flex"
        aria-label="Dashboard"
      >
        <div className="flex h-16 items-center border-b px-5">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {me ? (
            <SidebarNav items={items} pathname={pathname} />
          ) : (
            <NavSkeleton />
          )}
        </nav>
        {sidebarFooter}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open dashboard menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetHeader className="border-b">
                <SheetTitle render={<div />}>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 overflow-y-auto p-4">
                <SidebarNav
                  items={items}
                  pathname={pathname}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              </nav>
              {sidebarFooter}
            </SheetContent>
          </Sheet>
          <h1 className="font-display min-w-0 flex-1 truncate text-2xl">
            {current?.label ?? (isLoading ? "" : "Dashboard")}
          </h1>
          <Link
            href="/"
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
          >
            Back to site
          </Link>
          <ThemeToggle />
          {me ? <UserMenu me={me} /> : <Skeleton className="size-9" />}
        </header>
        <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8">
          <Suspense fallback={<PageSkeleton />}>
            <RequireUser fallback={<PageSkeleton />}>{children}</RequireUser>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
