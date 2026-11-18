"use client";

import {
  CheckCircle2Icon,
  CreditCardIcon,
  EyeIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PenLineIcon,
  PlayIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import {
  SortableHead,
  type SortState,
} from "@/components/shared/data-table/SortableHead";
import {
  TableEmptyRow,
  TableSkeletonRows,
} from "@/components/shared/data-table/TableStates";
import { TableCard } from "@/components/shared/data-table/TableToolbar";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { ErrorState } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isAdminRole, useCurrentUser } from "@/features/dashboard/useRole";
import { useUrlState } from "@/hooks/useUrlState";
import { formatDate, formatTaka, formatTime } from "@/lib/format";
import type { Appointment, AppointmentStatus } from "@/types/api";
import type { ListScope } from "../api";
import {
  useAppointments,
  useCancelAppointment,
  usePayAppointment,
  useUpdateAppointmentStatus,
} from "../hooks";
import { AppointmentDetailsDialog } from "./AppointmentDetailsDialog";
import { PrescriptionDialog } from "./PrescriptionDialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending payment" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

// Messages for the bKash redirect (?status=...) after payment.
const PAYMENT_RESULT: Record<
  string,
  { type: "success" | "error" | "info"; text: string }
> = {
  success: {
    type: "success",
    text: "Payment successful! Your appointment is confirmed and the invoice is in your inbox.",
  },
  failure: {
    type: "error",
    text: "The payment didn't go through. Your booking is still pending, so you can try paying again.",
  },
  cancel: {
    type: "info",
    text: "Payment cancelled. Your booking is pending; pay before the schedule starts to confirm it.",
  },
  full: {
    type: "info",
    text: "That schedule filled up while you were paying, so your payment was refunded automatically.",
  },
  error: {
    type: "error",
    text: "We couldn't confirm the payment. If money was deducted, please contact support.",
  },
};

const PAGE_SIZE = 10;

export function AppointmentsTable() {
  const me = useCurrentUser();
  const scope: ListScope =
    me.role === "PATIENT"
      ? "patient"
      : me.role === "DOCTOR"
        ? "doctor"
        : "admin";
  const { get, set } = useUrlState();

  const status = get("filter", "all");
  const page = Number(get("page", "1")) || 1;
  const sort: SortState = {
    sortBy: "createdAt",
    sortOrder: get("order") === "asc" ? "asc" : "desc",
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useAppointments(scope, {
      page,
      limit: PAGE_SIZE,
      status: status === "all" ? undefined : (status as AppointmentStatus),
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });

  const [viewing, setViewing] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [prescribing, setPrescribing] = useState<Appointment | null>(null);
  const cancel = useCancelAppointment();
  const pay = usePayAppointment();
  const updateStatus = useUpdateAppointmentStatus();

  // Show the bKash result once, then clean the URL.
  const paymentStatus = get("status");
  useEffect(() => {
    const result = PAYMENT_RESULT[paymentStatus];
    if (!result) return;
    // Fixed id: the toast shows once even if the effect re-runs.
    toast[result.type](result.text, {
      id: `payment-${paymentStatus}`,
      duration: 8000,
    });
    set({ status: null });
  }, [paymentStatus, set]);

  const isPatient = me.role === "PATIENT";
  const isDoctor = me.role === "DOCTOR";
  const isAdmin = isAdminRole(me.role);
  // Patient/Doctor/Payment columns depend on the role; Schedule, Serial, Status, Booked always show.
  const columns = (isPatient ? 0 : 1) + (isDoctor ? 0 : 2) + 4;

  return (
    <>
      <TableCard
        toolbar={
          <FilterSelect
            id="appointment-status"
            label="Status"
            value={status}
            options={STATUS_OPTIONS}
            onChange={(value) => set({ filter: value })}
            className="sm:w-56"
          />
        }
        footer={
          <Pagination
            meta={data?.meta}
            onPageChange={(p) => set({ page: p })}
            label="appointments"
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
          <Table
            className={isFetching && !isLoading ? "opacity-70" : undefined}
          >
            <TableHeader>
              <TableRow>
                {!isPatient && <TableHead>Patient</TableHead>}
                {!isDoctor && <TableHead>Doctor</TableHead>}
                <TableHead>Schedule</TableHead>
                <TableHead>Serial · Joining</TableHead>
                <TableHead>Status</TableHead>
                {!isDoctor && <TableHead>Payment</TableHead>}
                <SortableHead
                  field="createdAt"
                  sort={sort}
                  onSort={(s) =>
                    set({ order: s.sortOrder === "desc" ? null : "asc" })
                  }
                >
                  Booked
                </SortableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={columns + 1} />
              ) : !data?.data.length ? (
                <TableEmptyRow
                  columns={columns + 1}
                  message={
                    isPatient
                      ? "No appointments yet. Find a doctor to book your first consultation."
                      : "No appointments match this filter."
                  }
                />
              ) : (
                data.data.map((a) => {
                  const canPay = isPatient && a.status === "PENDING";
                  const canCancel =
                    (isPatient || isAdmin) &&
                    (a.status === "PENDING" || a.status === "CONFIRMED");
                  const canStart = isDoctor && a.status === "CONFIRMED";
                  const canComplete = isDoctor && a.status === "ONGOING";
                  const canPrescribe =
                    isDoctor && a.status === "COMPLETED" && !a.prescriptionUrl;
                  return (
                    <TableRow key={a.id}>
                      {!isPatient && (
                        <TableCell>
                          <p className="font-medium">{a.patient?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.patient?.contactNumber || a.patient?.email}
                          </p>
                        </TableCell>
                      )}
                      {!isDoctor && (
                        <TableCell>
                          <p className="font-medium">{a.doctor?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.doctor?.specialization}
                          </p>
                        </TableCell>
                      )}
                      <TableCell className="whitespace-nowrap">
                        <p>{formatDate(a.schedule.startDateTime)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(a.schedule.startDateTime)} –{" "}
                          {formatTime(a.schedule.endDateTime)}
                        </p>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {a.serialNumber ? (
                          <>
                            <span className="font-semibold">
                              #{a.serialNumber}
                            </span>{" "}
                            · {formatTime(a.joiningTime)}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={a.status} />
                      </TableCell>
                      {!isDoctor && (
                        <TableCell className="whitespace-nowrap">
                          {a.payment ? (
                            <div className="space-y-1">
                              <p className="font-medium">
                                {formatTaka(a.payment.amount)}
                              </p>
                              <StatusBadge status={a.payment.status} />
                            </div>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      )}
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(a.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Appointment actions"
                              />
                            }
                          >
                            <MoreHorizontalIcon />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem onClick={() => setViewing(a)}>
                              <EyeIcon /> View details
                            </DropdownMenuItem>
                            {a.prescriptionUrl && (
                              <DropdownMenuItem
                                render={
                                  // biome-ignore lint/a11y/useAnchorContent: the menu item's children become the link text
                                  <a
                                    href={a.prescriptionUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  />
                                }
                              >
                                <FileTextIcon /> Prescription PDF
                              </DropdownMenuItem>
                            )}
                            {canPay && (
                              <DropdownMenuItem
                                onClick={() => pay.mutate(a.id)}
                                disabled={pay.isPending}
                              >
                                <CreditCardIcon /> Pay with bKash
                              </DropdownMenuItem>
                            )}
                            {canStart && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: a.id,
                                    status: "ONGOING",
                                  })
                                }
                              >
                                <PlayIcon /> Start consultation
                              </DropdownMenuItem>
                            )}
                            {canComplete && (
                              <DropdownMenuItem
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: a.id,
                                    status: "COMPLETED",
                                  })
                                }
                              >
                                <CheckCircle2Icon /> Mark completed
                              </DropdownMenuItem>
                            )}
                            {canPrescribe && (
                              <DropdownMenuItem
                                onClick={() => setPrescribing(a)}
                              >
                                <PenLineIcon /> Write prescription
                              </DropdownMenuItem>
                            )}
                            {canCancel && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setCancelling(a)}
                                >
                                  <XCircleIcon /> Cancel appointment
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <AppointmentDetailsDialog
        appointment={viewing}
        onOpenChange={(open) => !open && setViewing(null)}
      />

      <ConfirmDialog
        open={Boolean(cancelling)}
        onOpenChange={(open) => !open && setCancelling(null)}
        title="Cancel this appointment?"
        description={
          cancelling?.status === "CONFIRMED"
            ? "If you cancel more than 1 hour before the schedule starts, your bKash payment is refunded automatically. Later cancellations are not refunded."
            : "This unpaid booking will be cancelled. You won't be able to book the same schedule again."
        }
        confirmLabel="Cancel appointment"
        isDestructive
        isLoading={cancel.isPending}
        onConfirm={() =>
          cancelling &&
          cancel.mutate(cancelling.id, { onSuccess: () => setCancelling(null) })
        }
      />

      {prescribing && (
        <PrescriptionDialog
          appointmentId={prescribing.id}
          patientName={prescribing.patient?.name ?? "the patient"}
          open
          onOpenChange={(open) => !open && setPrescribing(null)}
        />
      )}
    </>
  );
}
