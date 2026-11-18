"use client";

import { ExternalLinkIcon, FileTextIcon, VideoIcon } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDateTime, formatTaka, formatTime } from "@/lib/format";
import type { Appointment } from "@/types/api";

type Props = {
  appointment: Appointment | null;
  onOpenChange: (open: boolean) => void;
};

export function AppointmentDetailsDialog({ appointment, onOpenChange }: Props) {
  const isJoinable =
    appointment &&
    (appointment.status === "CONFIRMED" || appointment.status === "ONGOING");

  const rows = appointment
    ? [
        {
          label: "Doctor",
          value: appointment.doctor
            ? `${appointment.doctor.name} (${appointment.doctor.specialization})`
            : "—",
        },
        {
          label: "Patient",
          value: appointment.patient
            ? `${appointment.patient.name} · ${appointment.patient.email}`
            : "—",
        },
        {
          label: "Schedule",
          value: `${formatDateTime(appointment.schedule.startDateTime)} – ${formatTime(appointment.schedule.endDateTime)}`,
        },
        { label: "Serial number", value: appointment.serialNumber ?? "—" },
        {
          label: "Joining time",
          value: formatDateTime(appointment.joiningTime),
        },
        {
          label: "Payment",
          value: appointment.payment
            ? `${formatTaka(appointment.payment.amount)} · ${appointment.payment.status.toLowerCase()}`
            : "—",
        },
        {
          label: "bKash transaction",
          value: appointment.payment?.bkashTrxId ?? "—",
        },
        { label: "Booked on", value: formatDateTime(appointment.createdAt) },
      ]
    : [];

  return (
    <Dialog open={Boolean(appointment)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment details</DialogTitle>
          <DialogDescription render={<div />}>
            {appointment && <StatusBadge status={appointment.status} />}
          </DialogDescription>
        </DialogHeader>
        <dl className="divide-y rounded-xl border">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[130px_1fr] gap-3 px-4 py-2.5 text-sm"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium break-words">{row.value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-2">
          {isJoinable && (
            <a
              href={appointment.schedule.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <VideoIcon /> Join video call
            </a>
          )}
          {appointment?.prescriptionUrl && (
            <a
              href={appointment.prescriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <FileTextIcon /> View prescription{" "}
              <ExternalLinkIcon className="size-3.5" />
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
