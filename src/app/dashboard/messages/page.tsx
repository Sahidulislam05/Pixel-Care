import type { Metadata } from "next";
import { MessagesTable } from "@/features/users/components/MessagesTable";

// Session-gated, client-rendered page: instant-navigation validation does not apply.
export const instant = false;

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return <MessagesTable />;
}
