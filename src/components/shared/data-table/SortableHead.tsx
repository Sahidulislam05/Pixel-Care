"use client";

import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type SortState = { sortBy: string; sortOrder: "asc" | "desc" };

type SortableHeadProps = {
  field: string;
  sort: SortState;
  onSort: (next: SortState) => void;
  children: ReactNode;
  className?: string;
};

/** Column header that toggles asc/desc and exposes aria-sort to assistive tech. */
export function SortableHead({
  field,
  sort,
  onSort,
  children,
  className,
}: SortableHeadProps) {
  const isActive = sort.sortBy === field;
  const Icon = !isActive
    ? ArrowUpDownIcon
    : sort.sortOrder === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon;

  return (
    <TableHead
      className={className}
      aria-sort={
        isActive
          ? sort.sortOrder === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        type="button"
        onClick={() =>
          onSort({
            sortBy: field,
            sortOrder: isActive && sort.sortOrder === "desc" ? "asc" : "desc",
          })
        }
        className={cn(
          "-ml-2 inline-flex items-center gap-1.5 rounded-sm px-2 py-1 hover:bg-muted",
          isActive && "text-foreground",
        )}
      >
        {children}
        <Icon className={cn("size-3.5", !isActive && "opacity-40")} />
      </button>
    </TableHead>
  );
}
