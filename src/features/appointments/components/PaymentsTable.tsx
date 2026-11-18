"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
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
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { isAdminRole, useCurrentUser } from "@/features/dashboard/useRole";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
import { formatDate, formatDateTime, formatTaka } from "@/lib/format";
import { appointmentsApi } from "../api";

export function PaymentsTable() {
  const me = useCurrentUser();
  const isAdmin = isAdminRole(me.role);
  const { get, set } = useUrlState();
  const page = Number(get("page", "1")) || 1;
  const sort: SortState = {
    sortBy: get("sort", "createdAt"),
    sortOrder: get("order") === "asc" ? "asc" : "desc",
  };

  const [email, setEmail] = useState(get("email"));
  const debouncedEmail = useDebouncedValue(email.trim().toLowerCase(), 500);
  useEffect(() => {
    if (debouncedEmail !== get("email")) set({ email: debouncedEmail });
  }, [debouncedEmail, get, set]);

  const query = {
    page,
    limit: 10,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder,
    patientEmail: get("email") || undefined,
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payments", isAdmin ? "admin" : "patient", query],
    queryFn: () =>
      appointmentsApi.payments(isAdmin ? "admin" : "patient", query),
    placeholderData: keepPreviousData,
  });

  const columns = isAdmin ? 7 : 6;
  const onSort = (next: SortState) =>
    set({
      sort: next.sortBy === "createdAt" ? null : next.sortBy,
      order: next.sortOrder === "desc" ? null : "asc",
    });

  return (
    <TableCard
      toolbar={
        isAdmin && (
          <div className="grid gap-1.5 sm:w-80">
            <Label
              htmlFor="payment-email"
              className="text-xs text-muted-foreground"
            >
              Patient email (exact)
            </Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="payment-email"
                type="search"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                className="h-10 pl-9"
              />
            </div>
          </div>
        )
      }
      footer={
        <Pagination
          meta={data?.meta}
          onPageChange={(p) => set({ page: p })}
          label="payments"
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
              <TableHead>Doctor</TableHead>
              {isAdmin && <TableHead>Patient</TableHead>}
              <TableHead>Appointment</TableHead>
              <SortableHead field="amount" sort={sort} onSort={onSort}>
                Amount
              </SortableHead>
              <SortableHead field="status" sort={sort} onSort={onSort}>
                Status
              </SortableHead>
              <TableHead>bKash Trx ID</TableHead>
              <SortableHead field="createdAt" sort={sort} onSort={onSort}>
                Created
              </SortableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeletonRows columns={columns} />
            ) : !data?.data.length ? (
              <TableEmptyRow columns={columns} message="No payments found." />
            ) : (
              data.data.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium">
                      {p.appointment?.doctor?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.appointment?.doctor?.specialization}
                    </p>
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-muted-foreground">
                      {p.appointment?.patient?.email ?? "—"}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    {formatDateTime(p.appointment?.schedule.startDateTime)}
                  </TableCell>
                  <TableCell className="font-semibold whitespace-nowrap">
                    {formatTaka(p.amount)}
                    {p.refundAmount && (
                      <p className="text-xs font-normal text-muted-foreground">
                        Refunded {formatTaka(p.refundAmount)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {p.bkashTrxId ?? "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </TableCard>
  );
}
