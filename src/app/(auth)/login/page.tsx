import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-5xl">
          Welcome <em className="text-highlight">back</em>
        </h1>
        <p className="text-muted-foreground">
          Sign in to book consultations and see your records.
        </p>
      </div>
      <Suspense fallback={<Skeleton className="h-80 w-full" />}>
        <LoginForm />
      </Suspense>
      <p className="text-center text-sm text-muted-foreground">
        New to Pixel-Care?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
