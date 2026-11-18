"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CheckIcon,
  EyeIcon,
  FileTextIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate, formatTaka } from "@/lib/format";
import type { Doctor } from "@/types/api";
import { doctorsApi } from "../api";

const TABS = [
  { value: "PENDING", label: "Applications" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "all", label: "All" },
];

export function AdminDoctorsTable() {
  const queryClient = useQueryClient();
  const { get, set } = useUrlState();
  const tab = get("tab", "PENDING");
  const page = Number(get("page", "1")) || 1;
  const sort: SortState = {
    sortBy: get("sort", "createdAt"),
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
    verificationStatus: tab === "all" ? undefined : tab,
    ...sort,
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-doctors", query],
    queryFn: () => doctorsApi.adminList(query),
    placeholderData: keepPreviousData,
  });

  const [viewing, setViewing] = useState<Doctor | null>(null);
  const [rejecting, setRejecting] = useState<Doctor | null>(null);
  const [reason, setReason] = useState("");

  const review = useMutation({
    mutationFn: doctorsApi.review,
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      setRejecting(null);
      setViewing(null);
      setReason("");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const onSort = (next: SortState) =>
    set({
      sort: next.sortBy === "createdAt" ? null : next.sortBy,
      order: next.sortOrder === "desc" ? null : "asc",
    });

  return (
    <>
      <TableCard
        toolbar={
          <>
            <Tabs
              value={tab}
              onValueChange={(value) =>
                set({ tab: value === "PENDING" ? null : String(value) })
              }
            >
              <TabsList>
                {TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="grid gap-1.5 sm:ml-auto sm:w-72">
              <Label htmlFor="doctor-admin-search" className="sr-only">
                Search doctors
              </Label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="doctor-admin-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, email, licence, specialty"
                  className="h-10 pl-9"
                />
              </div>
            </div>
          </>
        }
        footer={
          <Pagination
            meta={data?.meta}
            onPageChange={(p) => set({ page: p })}
            label="doctors"
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
                <SortableHead field="name" sort={sort} onSort={onSort}>
                  Doctor
                </SortableHead>
                <TableHead>Specialization</TableHead>
                <SortableHead
                  field="experienceYears"
                  sort={sort}
                  onSort={onSort}
                >
                  Experience
                </SortableHead>
                <TableHead>Email verified</TableHead>
                <TableHead>Status</TableHead>
                <SortableHead field="createdAt" sort={sort} onSort={onSort}>
                  Applied
                </SortableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={7} />
              ) : !data?.data.length ? (
                <TableEmptyRow
                  columns={7}
                  message={
                    tab === "PENDING"
                      ? "No applications waiting for review."
                      : "No doctors found."
                  }
                />
              ) : (
                data.data.map((doctor) => {
                  const isEmailVerified =
                    doctor.user && "emailVerified" in doctor.user
                      ? doctor.user.emailVerified
                      : false;
                  const canReview =
                    doctor.verificationStatus === "PENDING" && isEmailVerified;
                  return (
                    <TableRow key={doctor.id}>
                      <TableCell>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.email}
                        </p>
                      </TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.experienceYears} yrs</TableCell>
                      <TableCell>
                        {isEmailVerified ? (
                          <StatusBadge status="ACTIVE" />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not yet
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={doctor.verificationStatus ?? "PENDING"}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(doctor.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setViewing(doctor)}
                            aria-label={`View ${doctor.name}`}
                          >
                            <EyeIcon />
                          </Button>
                          {canReview && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  review.mutate({
                                    doctorId: doctor.id,
                                    verificationStatus: "APPROVED",
                                  })
                                }
                                disabled={review.isPending}
                              >
                                <CheckIcon /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setRejecting(doctor)}
                              >
                                <XIcon /> Reject
                              </Button>
                            </>
                          )}
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

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
            <DialogDescription>{viewing?.specialization}</DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="divide-y rounded-xl border text-sm">
              {[
                ["Email", viewing.email],
                ["Phone", viewing.contactNumber ?? "—"],
                ["BMDC licence", viewing.licenseNumber],
                ["Qualifications", viewing.qualifications],
                ["Experience", `${viewing.experienceYears} years`],
                ["Fee", formatTaka(viewing.consultationFee)],
                ["Location", viewing.address ?? "—"],
                ["Bio", viewing.bio ?? "—"],
                ...(viewing.rejectionReason
                  ? [["Rejection reason", viewing.rejectionReason]]
                  : []),
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-[120px_1fr] gap-3 px-4 py-2.5"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium break-words">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          {viewing?.resume && (
            <a
              href={viewing.resume}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "outline",
                className: "w-fit",
              })}
            >
              <FileTextIcon /> Open resume
            </a>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rejecting)}
        onOpenChange={(open) => !open && setRejecting(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>
              {rejecting?.name} will receive this reason by email.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (reason.trim().length < 10 || !rejecting) return;
              review.mutate({
                doctorId: rejecting.id,
                verificationStatus: "REJECTED",
                rejectionReason: reason.trim(),
              });
            }}
            className="grid gap-4"
          >
            <FormField
              id="reject-reason"
              label="Reason"
              required
              error={
                reason && reason.trim().length < 10
                  ? "Please write at least 10 characters"
                  : undefined
              }
            >
              <Textarea
                id="reject-reason"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                aria-describedby="reject-reason-message"
              />
            </FormField>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejecting(null)}
              >
                Cancel
              </Button>
              <SubmitButton
                variant="destructive"
                isLoading={review.isPending}
                disabled={reason.trim().length < 10}
              >
                Reject application
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
