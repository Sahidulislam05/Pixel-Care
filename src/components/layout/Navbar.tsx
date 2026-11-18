"use client";

import { LayoutDashboardIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { publicNavLinks } from "@/config/site";
import { useLogout, useMe } from "@/features/auth/hooks";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname.startsWith(href);

export function Navbar() {
  const pathname = usePathname();
  const { data: me, isLoading } = useMe();
  const logout = useLogout();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // The bar floats with breathing room at the top, then tightens once you scroll.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = me
    ? [...publicNavLinks, { href: "/dashboard", label: "Dashboard" }]
    : publicNavLinks;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full px-3 transition-[padding] duration-300 sm:px-4",
        isScrolled ? "pt-2" : "pt-4",
      )}
    >
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-xl border px-3 transition-all duration-300 sm:px-4",
          isScrolled
            ? "h-14 border-border bg-background/80 shadow-lg shadow-foreground/5 backdrop-blur-xl"
            : "h-16 border-transparent bg-transparent",
        )}
      >
        <Logo />

        <ul className="hidden items-center gap-0.5 rounded-xl border bg-card/60 p-1 backdrop-blur lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={
                  isActive(pathname, link.href) ? "page" : undefined
                }
                className={cn(
                  "block rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
                  isActive(pathname, link.href) &&
                    "bg-foreground text-background shadow-sm hover:text-background",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoading ? (
            <Skeleton className="h-9 w-24" />
          ) : me ? (
            <UserMenu me={me} />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost" })}
              >
                Sign in
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Get started
              </Link>
            </div>
          )}

          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle render={<div />}>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <ul className="grid gap-1 px-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      aria-current={
                        isActive(pathname, link.href) ? "page" : undefined
                      }
                      className={cn(
                        "block rounded-xl px-3 py-2.5 text-base font-medium transition-colors hover:bg-muted",
                        isActive(pathname, link.href) &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto grid gap-2 border-t p-4">
                {me ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      <LayoutDashboardIcon /> Dashboard
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => logout.mutate()}
                      className="text-destructive"
                    >
                      <LogOutIcon /> Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsMobileOpen(false)}
                      className={buttonVariants()}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
