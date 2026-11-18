"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Schedule } from "@/types/api";
import { schedulesApi, useScheduleMutation } from "../api";

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Mirrors the API rules: same day, not in the past, 3-8 hours long.
const ScheduleSchema = z
  .object({
    date: z.string().min(1, "Pick a date"),
    startTime: z.string().min(1, "Pick a start time"),
    endTime: z.string().min(1, "Pick an end time"),
    meetingLink: z.url("Enter a valid meeting link (https://…)"),
  })
  .refine((v) => new Date(`${v.date}T${v.startTime}`) > new Date(), {
    path: ["startTime"],
    message: "Start time must be in the future",
  })
  .refine((v) => toMinutes(v.endTime) - toMinutes(v.startTime) >= 180, {
    path: ["endTime"],
    message: "A schedule must be at least 3 hours long",
  })
  .refine((v) => toMinutes(v.endTime) - toMinutes(v.startTime) <= 480, {
    path: ["endTime"],
    message: "A schedule can be at most 8 hours long",
  });
type ScheduleInput = z.infer<typeof ScheduleSchema>;

const pad = (n: number) => String(n).padStart(2, "0");
const toDateInput = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toTimeInput = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Schedule | null;
};

export function ScheduleFormDialog({ open, onOpenChange, schedule }: Props) {
  const isEdit = Boolean(schedule);
  const isPublished = schedule?.status === "PUBLISHED";
  const hasBookings = schedule
    ? schedule.availableSlots < schedule.totalSlots
    : false;

  const form = useForm<ScheduleInput>({
    resolver: zodResolver(ScheduleSchema),
  });
  const { errors } = form.formState;

  useEffect(() => {
    if (!open) return;
    if (schedule) {
      const start = new Date(schedule.startDateTime);
      const end = new Date(schedule.endDateTime);
      form.reset({
        date: toDateInput(start),
        startTime: toTimeInput(start),
        endTime: toTimeInput(end),
        meetingLink: schedule.meetingLink,
      });
    } else {
      form.reset({
        date: toDateInput(new Date()),
        startTime: "",
        endTime: "",
        meetingLink: "",
      });
    }
  }, [open, schedule, form]);

  const create = useScheduleMutation(
    schedulesApi.create,
    "Schedule created as draft. Publish it to accept bookings.",
  );
  const update = useScheduleMutation(
    ({
      id,
      body,
    }: {
      id: string;
      body: Parameters<typeof schedulesApi.update>[1];
    }) => schedulesApi.update(id, body),
    "Schedule updated",
  );

  const onSubmit = form.handleSubmit((values) => {
    const body = {
      startDateTime: new Date(
        `${values.date}T${values.startTime}`,
      ).toISOString(),
      endDateTime: new Date(`${values.date}T${values.endTime}`).toISOString(),
      meetingLink: values.meetingLink,
    };
    const done = { onSuccess: () => onOpenChange(false) };
    if (schedule) {
      // Once booked, only the meet link can change (spec 6.2).
      update.mutate(
        {
          id: schedule.id,
          body: hasBookings ? { meetingLink: body.meetingLink } : body,
        },
        done,
      );
    } else {
      create.mutate(body, done);
    }
  });

  const isTimeLocked = hasBookings;
  const isDateLocked = isPublished || hasBookings;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit schedule" : "New schedule"}</DialogTitle>
          <DialogDescription>
            One schedule per day, 3–8 hours long. It's split into 20-minute
            slots automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <FormField
            id="sch-date"
            label="Date"
            required
            error={errors.date?.message}
            hint={isDateLocked ? "Locked after publishing." : undefined}
          >
            <Input
              {...fieldA11y("sch-date", errors.date?.message)}
              type="date"
              min={toDateInput(new Date())}
              disabled={isDateLocked}
              {...form.register("date")}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="sch-start"
              label="Start time"
              required
              error={errors.startTime?.message}
            >
              <Input
                {...fieldA11y("sch-start", errors.startTime?.message)}
                type="time"
                disabled={isTimeLocked}
                {...form.register("startTime")}
              />
            </FormField>
            <FormField
              id="sch-end"
              label="End time"
              required
              error={errors.endTime?.message}
            >
              <Input
                {...fieldA11y("sch-end", errors.endTime?.message)}
                type="time"
                disabled={isTimeLocked}
                {...form.register("endTime")}
              />
            </FormField>
          </div>
          {isTimeLocked && (
            <p className="text-sm text-muted-foreground">
              Patients have booked this schedule, so only the meeting link can
              change.
            </p>
          )}
          <FormField
            id="sch-link"
            label="Video meeting link"
            required
            error={errors.meetingLink?.message}
            hint="Google Meet, Zoom or any video link. Shared with every patient in this schedule."
          >
            <Input
              {...fieldA11y("sch-link", errors.meetingLink?.message)}
              type="url"
              placeholder="https://meet.google.com/…"
              {...form.register("meetingLink")}
            />
          </FormField>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <SubmitButton
              isLoading={create.isPending || update.isPending}
              loadingText="Saving…"
            >
              {isEdit ? "Save changes" : "Create schedule"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
