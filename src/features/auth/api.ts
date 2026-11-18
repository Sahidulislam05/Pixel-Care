import { api } from "@/lib/api-client";
import type { Me } from "@/types/api";

export const authApi = {
  me: () => api<Me>("/auth/me").then((r) => r.data),
  login: (body: { email: string; password: string }) =>
    api("/auth/login", { method: "POST", body }),
  google: (idToken: string) =>
    api("/auth/google", { method: "POST", body: { idToken } }),
  logout: () => api<null>("/auth/logout", { method: "POST" }),
  register: (body: {
    name: string;
    email: string;
    password: string;
    patient?: { contactNumber?: string };
  }) => api<null>("/auth/register", { method: "POST", body }),
  verifyEmail: (body: { email: string; otp: string }) =>
    api("/auth/verify-email", { method: "POST", body }),
  forgotPassword: (body: { email: string }) =>
    api<null>("/auth/forgot-password", { method: "POST", body }),
  resetPassword: (body: { email: string; otp: string; newPassword: string }) =>
    api<null>("/auth/reset-password", { method: "POST", body }),
  changePassword: (body: { currentPassword?: string; newPassword: string }) =>
    api<null>("/auth/change-password", { method: "POST", body }),
};
