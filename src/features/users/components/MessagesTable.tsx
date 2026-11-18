"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MailIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SortableHead,
  type SortState,
} from "@/components/shared/data-table/SortableHead";
import {
  TableEmptyRow,
  TableSkeletonRows,
} from "@/components/shared/data-table/TableStates";
import { TableCard } from "@/components/shared/data-table/TableToolbar";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/States";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
import { formatDateTime } from "@/lib/format";
import type { ContactMessage } from "@/types/api";
import { usersApi } from "../api";

export function MessagesTable() {
  const { get, set } = useUrlState();
  const page = Number(get("page", "1")) || 1;
  const sort: SortState = {
    sortBy: "createdAt",
    sortOrder: get("order") === "asc" ? "asc" : "desc",
  };

  const [search, setSearch] = useState(get("q"));
  const debounced = useDebouncedValue(search.trim());
  useEffect(() => {
    if (debounced !== get("q")) set({ q: debounced });
  }, [debounced, get, set]);

  const query = {
    page,
    limit: 10,
    searchTerm: get("q") || undefined,
    sortOrder: sort.sortOrder,
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contact-messages", query],
    queryFn: () => usersApi.messages(query),
    placeholderData: keepPreviousData,
  });
  const [open, setOpen] = useState<ContactMessage | null>(null);

  return (
    <>
      <TableCard
        toolbar={
          <div className="grid gap-1.5 sm:w-80">
            <Label
              htmlFor="msg-search"
              className="text-xs text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="msg-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, email or subject"
                className="h-10 pl-9"
              />
            </div>
          </div>
        }
        footer={
          <Pagination
            meta={data?.meta}
            onPageChange={(p) => set({ page: p })}
            label="messages"
          />
        }
      >
        {isError ? (
          <ErrorState
            message={error.message}
            onRetry={() => refetch()}
            className="m-4"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <SortableHead
                  field="createdAt"
                  sort={sort}
                  onSort={(s) =>
                    set({ order: s.sortOrder === "desc" ? null : "asc" })
                  }
                >
                  Received
                </SortableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={4} />
              ) : !data?.data.length ? (
                <TableEmptyRow columns={4} message="No messages yet." />
              ) : (
                data.data.map((m) => (
                  <TableRow
                    key={m.id}
                    className="cursor-pointer"
                    onClick={() => setOpen(m)}
                  >
                    <TableCell>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate font-medium">{m.subject}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.message}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(m.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        type="button"
                        className="text-sm font-medium text-primary hover:underline"
                        onClick={() => setOpen(m)}
                      >
                        Read
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <Dialog open={Boolean(open)} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{open?.subject}</DialogTitle>
            <DialogDescription>
              {open?.name} · {open?.email} · {formatDateTime(open?.createdAt)}
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-xl bg-muted p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {open?.message}
          </p>
          {open && (
            <a
              href={`mailto:${open.email}?subject=${encodeURIComponent(`Re: ${open.subject}`)}`}
              className={buttonVariants({ className: "w-fit" })}
            >
              <MailIcon /> Reply by email
            </a>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
