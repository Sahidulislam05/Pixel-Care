import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-5xl">
          Create your <em className="text-highlight">account</em>
        </h1>
        <p className="text-muted-foreground">
          Free for patients. Book your first consultation in minutes.
        </p>
      </div>
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
        <br />
        Are you a doctor?{" "}
        <Link
          href="/apply-as-doctor"
          className="font-semibold text-primary hover:underline"
        >
          Apply to join
        </Link>
      </p>
    </div>
  );
}
