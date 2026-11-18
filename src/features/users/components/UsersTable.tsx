"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  BanIcon,
  CheckCircle2Icon,
  SearchIcon,
  UserPlusIcon,
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
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { roleLabel } from "@/config/dashboard-nav";
import { isAdminRole, useCurrentUser } from "@/features/dashboard/useRole";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
import { getErrorMessage } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { User } from "@/types/api";
import { usersApi } from "../api";
import { CreateAdminDialog } from "./CreateAdminDialog";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "PATIENT", label: "Patients" },
  { value: "DOCTOR", label: "Doctors" },
  { value: "ADMIN", label: "Admins" },
  { value: "SUPER_ADMIN", label: "Super admins" },
];
const STATUS_OPTIONS = [
  { value: "all", label: "Any status" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
];

export function UsersTable() {
  const me = useCurrentUser();
  const queryClient = useQueryClient();
  const { get, set } = useUrlState();
  const role = get("role", "all");
  const status = get("status", "all");
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
    role: role === "all" ? undefined : role,
    status: status === "all" ? undefined : status,
    ...sort,
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["users", query],
    queryFn: () => usersApi.list(query),
    placeholderData: keepPreviousData,
  });

  const [target, setTarget] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const toggle = useMutation({
    mutationFn: (user: User) =>
      usersApi.setStatus(
        user.id,
        user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED",
      ),
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setTarget(null);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  // Mirrors the API rule: only a super admin can act on admins; nobody acts on themselves.
  const canManage = (user: User) =>
    user.id !== me.id && (!isAdminRole(user.role) || me.role === "SUPER_ADMIN");
  const onSort = (next: SortState) =>
    set({
      sort: next.sortBy === "createdAt" ? null : next.sortBy,
      order: next.sortOrder === "desc" ? null : "asc",
    });
  const isBlocking = target?.status !== "BLOCKED";

  return (
    <>
      <TableCard
        toolbar={
          <>
            <div className="grid gap-1.5 sm:w-72">
              <Label
                htmlFor="user-search"
                className="text-xs text-muted-foreground"
              >
                Search
              </Label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="user-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name or email"
                  className="h-10 pl-9"
                />
              </div>
            </div>
            <FilterSelect
              id="user-role"
              label="Role"
              value={role}
              options={ROLE_OPTIONS}
              onChange={(v) => set({ role: v })}
              className="sm:w-44"
            />
            <FilterSelect
              id="user-status"
              label="Status"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(v) => set({ status: v })}
              className="sm:w-40"
            />
            <Button className="sm:ml-auto" onClick={() => setIsCreating(true)}>
              <UserPlusIcon /> Create admin
            </Button>
          </>
        }
        footer={
          <Pagination
            meta={data?.meta}
            onPageChange={(p) => set({ page: p })}
            label="users"
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
                  User
                </SortableHead>
                <SortableHead field="role" sort={sort} onSort={onSort}>
                  Role
                </SortableHead>
                <TableHead>Sign-in</TableHead>
                <SortableHead field="status" sort={sort} onSort={onSort}>
                  Status
                </SortableHead>
                <SortableHead field="createdAt" sort={sort} onSort={onSort}>
                  Joined
                </SortableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeletonRows columns={6} />
              ) : !data?.data.length ? (
                <TableEmptyRow
                  columns={6}
                  message="No users match these filters."
                />
              ) : (
                data.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} imageUrl={user.imageUrl} />
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {user.name}{" "}
                            {user.id === me.id && (
                              <span className="text-xs text-muted-foreground">
                                (you)
                              </span>
                            )}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isAdminRole(user.role) ? "default" : "outline"}
                      >
                        {roleLabel[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.authProvider === "GOOGLE" ? "Google" : "Email"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {canManage(user) &&
                        (user.status === "BLOCKED" ? (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setTarget(user)}
                          >
                            <CheckCircle2Icon /> Unblock
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setTarget(user)}
                          >
                            <BanIcon /> Block
                          </Button>
                        ))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableCard>

      <ConfirmDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        title={
          isBlocking ? `Block ${target?.name}?` : `Unblock ${target?.name}?`
        }
        description={
          isBlocking
            ? "They will be signed out and can't log in until unblocked."
            : "They will be able to sign in again."
        }
        confirmLabel={isBlocking ? "Block user" : "Unblock user"}
        isDestructive={isBlocking}
        isLoading={toggle.isPending}
        onConfirm={() => target && toggle.mutate(target)}
      />
      <CreateAdminDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        canCreateSuperAdmin={me.role === "SUPER_ADMIN"}
      />
    </>
  );
}
