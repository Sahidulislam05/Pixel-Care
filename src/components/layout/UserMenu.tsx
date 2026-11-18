"use client";

import {
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserCogIcon,
} from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dashboardNav, roleLabel } from "@/config/dashboard-nav";
import { useLogout } from "@/features/auth/hooks";
import type { Me } from "@/types/api";

export function UserMenu({ me }: { me: Me }) {
  const logout = useLogout();
  // Quick links: the role's dashboard pages, minus overview/profile shown separately.
  const quickLinks = dashboardNav[me.role].filter(
    (item) =>
      item.href.startsWith("/dashboard/") && item.href !== "/dashboard/profile",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label="Open account menu"
      >
        <UserAvatar name={me.name} imageUrl={me.imageUrl} className="size-8" />
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
            <span className="truncate text-sm font-semibold text-foreground">
              {me.name}
            </span>
            <span className="truncate text-xs font-normal text-muted-foreground">
              {me.email}
            </span>
            <span className="mt-1 w-fit rounded-sm bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              {roleLabel[me.role]}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<Link href="/dashboard" />}>
            <LayoutDashboardIcon /> Dashboard
          </DropdownMenuItem>
          {quickLinks.map((item) => (
            <DropdownMenuItem
              key={item.href}
              render={<Link href={item.href} />}
            >
              <item.icon /> {item.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
            <UserCogIcon /> Profile & Security
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          <LogOutIcon /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
