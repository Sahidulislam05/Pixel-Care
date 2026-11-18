import { api } from "@/lib/api-client";
import type { ContactMessage, Me, User } from "@/types/api";

export type UserQuery = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const usersApi = {
  list: (query: UserQuery) => api<User[]>("/user", { query }),
  setStatus: (userId: string, status: "ACTIVE" | "BLOCKED") =>
    api<User>(`/user/${userId}/status`, { method: "PATCH", body: { status } }),
  createAdmin: (body: {
    name: string;
    email: string;
    personalEmail: string;
    role: "ADMIN" | "SUPER_ADMIN";
  }) => api<User>("/user/create-admin", { method: "POST", body }),
  updateMe: (body: {
    name?: string;
    contactNumber?: string;
    address?: string;
  }) => api<Me>("/user/me", { method: "PATCH", body }),
  uploadAvatar: (file: File) => {
    const form = new FormData();
    form.append("profileImage", file);
    return api<User>("/user/profile-image", { method: "PATCH", body: form });
  },
  messages: (query: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortOrder?: "asc" | "desc";
  }) => api<ContactMessage[]>("/contact", { query }),
};
