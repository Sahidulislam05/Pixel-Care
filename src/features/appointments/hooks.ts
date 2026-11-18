"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api-client";
import {
  type AppointmentListQuery,
  appointmentsApi,
  type ListScope,
} from "./api";

export const appointmentKeys = {
  all: ["appointments"] as const,
  list: (scope: ListScope, query: AppointmentListQuery) =>
    ["appointments", scope, query] as const,
};

export function useAppointments(scope: ListScope, query: AppointmentListQuery) {
  return useQuery({
    queryKey: appointmentKeys.list(scope, query),
    queryFn: () => appointmentsApi.list(scope, query),
    placeholderData: keepPreviousData,
  });
}

/** Mutations that change appointment state refresh lists, payments and analytics. */
function useAppointmentMutation<TArgs, TResult>(
  mutationFn: (args: TArgs) => Promise<TResult>,
  successMessage: (result: TResult) => string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      toast.success(successMessage(result));
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export const useCancelAppointment = () =>
  useAppointmentMutation(appointmentsApi.cancel, ({ data }) =>
    data.refunded
      ? "Appointment cancelled and refunded"
      : "Appointment cancelled",
  );

export const useUpdateAppointmentStatus = () =>
  useAppointmentMutation(
    ({ id, status }: { id: string; status: "ONGOING" | "COMPLETED" }) =>
      appointmentsApi.updateStatus(id, status),
    ({ data }) =>
      data.status === "ONGOING"
        ? "Consultation started"
        : "Consultation marked as completed",
  );

export const useCreatePrescription = () =>
  useAppointmentMutation(
    appointmentsApi.createPrescription,
    () => "Prescription sent to the patient",
  );

export function usePayAppointment() {
  return useMutation({
    mutationFn: appointmentsApi.pay,
    onSuccess: ({ data }) => {
      toast.success("Redirecting you to bKash…");
      window.location.assign(data.paymentUrl);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
