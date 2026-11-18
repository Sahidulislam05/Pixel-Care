import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordFlow } from "@/features/auth/components/ForgotPasswordFlow";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-5xl">
          Reset your <em className="text-highlight">password</em>
        </h1>
        <p className="text-muted-foreground">
          We'll email you a code to set a new one.
        </p>
      </div>
      <ForgotPasswordFlow />
      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
