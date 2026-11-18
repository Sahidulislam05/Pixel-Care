"use client";

import {
  ExternalLinkIcon,
  PencilIcon,
  PlusIcon,
  SendIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUrlState } from "@/hooks/useUrlState";
import { formatDate, formatTime } from "@/lib/format";
import type { Schedule } from "@/types/api";
import { schedulesApi, useMySchedules, useScheduleMutation } from "../api";
import { ScheduleFormDialog } from "./ScheduleFormDialog";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

export function SchedulesTable() {
  const { get, set } = useUrlState();
  const status = get("filter", "all");
  const page = Number(get("page", "1")) || 1;
  const sort: SortState = {
    sortBy: get("sort", "startDateTime"),
    sortOrder: get("order") === "asc" ? "asc" : "desc",
  };

  const { data, isLoading, isError, error, refetch } = useMySchedules({
    page,
    limit: 10,
    status: status === "all" ? undefined : status,
    ...sort,
  });

  const [editing, setEditing] = useState<Schedule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleting, setDeleting] = useState<Schedule | null>(null);
  const publish = useScheduleMutation(
    schedulesApi.publish,
    "Schedule published. Patients can book it today.",
  );
  const remove = useScheduleMutation(schedulesApi.remove, "Schedule deleted");

  const onSort = (next: SortState) =>
    set({
      sort: next.sortBy === "startDateTime" ? null : next.sortBy,
      order: next.sortOrder === "desc" ? null : "asc",
    });

  return (
    <>
      <TableCard
        toolbar={
          <>
            <FilterSelect
              id="schedule-status"
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(v) => set({ filter: v })}
              className="sm:w-48"
            />
            <Button className="sm:ml-auto" onClick={() => setIsCreating(true)}>
              <PlusIcon /> New schedule
            </Button>
          </>
        }
        footer={
          <Pagination
            meta={data?.meta}
            onPageChange={(p) => set({ page: p })}
            label="schedules"
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
                <SortableHead field="startDateTime" sort={sort} onSort={onSort}>
                  Date
                </SortableHead>
                <TableHead>Time</TableHead>
                <SortableHead
                  field="availableSlots"
                  sort={sort}
                  onSort={onSort}
                >
                  Slots left
                </SortableHead>
                <TableHead>Status</TableHead>
                <TableHead>Meeting</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={6} />
              ) : !data?.data.length ? (
                <TableEmptyRow
                  columns={6}
                  message="No schedules yet. Create one, then publish it so patients can book."
                />
              ) : (
                data.data.map((s) => {
                  const booked = s.totalSlots - s.availableSlots;
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(s.startDateTime)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatTime(s.startDateTime)} –{" "}
                        {formatTime(s.endDateTime)}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          {s.availableSlots}
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          / {s.totalSlots}
                        </span>
                        {booked > 0 && (
                          <p className="text-xs text-secondary-foreground">
                            {booked} booked
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={s.status} />
                      </TableCell>
                      <TableCell>
                        <a
                          href={s.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                        >
                          Open <ExternalLinkIcon className="size-3.5" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {s.status === "DRAFT" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => publish.mutate(s.id)}
                              disabled={publish.isPending}
                            >
                              <SendIcon /> Publish
                            </Button>
                          )}
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setEditing(s)}
                            aria-label={`Edit schedule on ${formatDate(s.startDateTime)}`}
                          >
                            <PencilIcon />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => setDeleting(s)}
                            disabled={booked > 0}
                            aria-label={`Delete schedule on ${formatDate(s.startDateTime)}`}
                            title={
                              booked > 0
                                ? "Schedules with bookings can't be deleted"
                                : undefined
                            }
                          >
                            <Trash2Icon />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <ScheduleFormDialog
        open={isCreating || Boolean(editing)}
        schedule={editing}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreating(false);
            setEditing(null);
          }
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Delete this schedule?"
        description={
          deleting
            ? `${formatDate(deleting.startDateTime)}, ${formatTime(deleting.startDateTime)} – ${formatTime(deleting.endDateTime)}. Patients will no longer see it.`
            : ""
        }
        confirmLabel="Delete schedule"
        isDestructive
        isLoading={remove.isPending}
        onConfirm={() =>
          deleting &&
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }
      />
    </>
  );
}
