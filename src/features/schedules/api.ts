"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { api, getErrorMessage } from "@/lib/api-client";
import type { Schedule } from "@/types/api";

export type ScheduleQuery = {
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export type SchedulePayload = {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
};

export const schedulesApi = {
  mine: (query: ScheduleQuery) =>
    api<Schedule[]>("/schedule/my-schedules", { query }),
  create: (body: SchedulePayload) =>
    api<Schedule>("/schedule/create-schedule", { method: "POST", body }),
  update: (id: string, body: Partial<SchedulePayload>) =>
    api<Schedule>(`/schedule/update-schedule/${id}`, { method: "PATCH", body }),
  publish: (id: string) =>
    api<Schedule>(`/schedule/publish-schedule/${id}`, { method: "PATCH" }),
  remove: (id: string) =>
    api<Schedule>(`/schedule/${id}`, { method: "DELETE" }),
};

export function useMySchedules(query: ScheduleQuery) {
  return useQuery({
    queryKey: ["schedules", "mine", query],
    queryFn: () => schedulesApi.mine(query),
    placeholderData: keepPreviousData,
  });
}

export function useScheduleMutation<TArgs>(
  mutationFn: (args: TArgs) => Promise<unknown>,
  success: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(success);
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
