"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type DoctorListQuery, doctorsApi } from "./api";

export const doctorKeys = {
  list: (query: DoctorListQuery) => ["doctors", "list", query] as const,
  availableToday: (query: DoctorListQuery) =>
    ["doctors", "available-today", query] as const,
  todaysSchedules: (doctorId: string) =>
    ["doctors", doctorId, "todays-schedules"] as const,
};

export function useDoctors(query: DoctorListQuery) {
  return useQuery({
    queryKey: doctorKeys.list(query),
    queryFn: () => doctorsApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useAvailableToday(query: DoctorListQuery, enabled = true) {
  return useQuery({
    queryKey: doctorKeys.availableToday(query),
    queryFn: () => doctorsApi.availableToday(query),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useTodaysSchedules(doctorId: string) {
  return useQuery({
    queryKey: doctorKeys.todaysSchedules(doctorId),
    queryFn: () => doctorsApi.todaysSchedules(doctorId),
  });
}
