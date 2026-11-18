"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { authApi } from "./api";

export const meQueryKey = ["auth", "me"] as const;

/** Shared options so useMe and the suspending RequireUser read the same cache entry. */
export const meQueryOptions = {
  queryKey: meQueryKey,
  queryFn: async () => {
    try {
      return await authApi.me();
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403)
      )
        return null;
      throw error;
    }
  },
  staleTime: 5 * 60 * 1000,
  retry: false,
} as const;

/** Current user, or null when signed out. */
export function useMe() {
  return useQuery(meQueryOptions);
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      queryClient.clear();
      queryClient.setQueryData(meQueryKey, null);
      toast.success("You've been signed out");
      router.replace("/login");
      router.refresh();
    },
  });
}

/** Only same-site paths: "//evil.com" or "https://…" would be an open redirect. */
export const safeRedirect = (target?: string | null) =>
  target?.startsWith("/") &&
  !target.startsWith("//") &&
  !target.startsWith("/\\")
    ? target
    : "/dashboard";

/** Runs a sign-in call, primes the user cache and sends the user where they were headed. */
function useSignIn<TArgs>(
  signIn: (args: TArgs) => Promise<unknown>,
  redirectTo?: string | null,
) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: signIn,
    onSuccess: async () => {
      // staleTime 0: after a logout the cache holds `null`, which must not be reused.
      const me = await queryClient.fetchQuery({
        queryKey: meQueryKey,
        queryFn: authApi.me,
        staleTime: 0,
      });
      toast.success(`Welcome, ${me.name.split(" ")[0]}!`);
      router.replace(safeRedirect(redirectTo));
      router.refresh();
    },
  });
}

export const useLogin = (redirectTo?: string | null) =>
  useSignIn(authApi.login, redirectTo);

export const useGoogleLogin = (redirectTo?: string | null) =>
  useSignIn((idToken: string) => authApi.google(idToken), redirectTo);
