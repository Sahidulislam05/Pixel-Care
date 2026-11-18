"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-client";
import { authApi } from "../api";
import {
  type ForgotPasswordInput,
  ForgotPasswordSchema,
  type ResetPasswordInput,
  ResetPasswordSchema,
} from "../schemas";

/** Step 1: request a code by email. Step 2: code + new password. */
export function ForgotPasswordFlow() {
  const [email, setEmail] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const emailForm = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const requestCode = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, { email: sentTo }) => {
      setEmail(sentTo);
      toast.success("Reset code sent. Check your inbox.");
    },
  });
  const reset = useMutation({
    mutationFn: (values: ResetPasswordInput) =>
      authApi.resetPassword({
        email: email ?? "",
        otp: values.otp,
        newPassword: values.newPassword,
      }),
    onSuccess: () => setIsDone(true),
  });

  if (isDone) {
    return (
      <output className="block space-y-4 text-center">
        <CheckCircle2Icon className="mx-auto size-12 text-secondary-foreground" />
        <h2 className="text-xl font-semibold">Password updated</h2>
        <p className="text-muted-foreground">
          You can now sign in with your new password.
        </p>
        <Link
          href="/login"
          className={buttonVariants({ size: "lg", className: "w-full" })}
        >
          Go to sign in
        </Link>
      </output>
    );
  }

  if (!email) {
    const error = emailForm.formState.errors.email?.message;
    return (
      <form
        onSubmit={emailForm.handleSubmit((values) =>
          requestCode.mutate(values),
        )}
        noValidate
        className="grid gap-5"
      >
        {requestCode.isError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {getErrorMessage(requestCode.error)}
          </p>
        )}
        <FormField
          id="forgot-email"
          label="Account email"
          required
          error={error}
        >
          <Input
            {...fieldA11y("forgot-email", error)}
            type="email"
            autoComplete="email"
            {...emailForm.register("email")}
          />
        </FormField>
        <SubmitButton
          isLoading={requestCode.isPending}
          loadingText="Sending code…"
          size="lg"
        >
          Send reset code
        </SubmitButton>
      </form>
    );
  }

  const { errors } = resetForm.formState;
  return (
    <form
      onSubmit={resetForm.handleSubmit((values) => reset.mutate(values))}
      noValidate
      className="grid gap-5"
    >
      <p className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
        Enter the code sent to <strong>{email}</strong> (valid for 5 minutes)
        and choose a new password.
      </p>
      {reset.isError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {getErrorMessage(reset.error)}
        </p>
      )}
      <FormField
        id="reset-otp"
        label="Reset code"
        required
        error={errors.otp?.message}
      >
        <Input
          {...fieldA11y("reset-otp", errors.otp?.message)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          className="tracking-[0.4em]"
          {...resetForm.register("otp")}
        />
      </FormField>
      <FormField
        id="reset-new"
        label="New password"
        required
        error={errors.newPassword?.message}
        hint="8+ characters with upper & lowercase, a number and a symbol."
      >
        <PasswordInput
          {...fieldA11y("reset-new", errors.newPassword?.message)}
          autoComplete="new-password"
          {...resetForm.register("newPassword")}
        />
      </FormField>
      <FormField
        id="reset-confirm"
        label="Confirm new password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          {...fieldA11y("reset-confirm", errors.confirmPassword?.message)}
          autoComplete="new-password"
          {...resetForm.register("confirmPassword")}
        />
      </FormField>
      <SubmitButton
        isLoading={reset.isPending}
        loadingText="Updating…"
        size="lg"
      >
        Update password
      </SubmitButton>
      <button
        type="button"
        onClick={() => setEmail(null)}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Use a different email
      </button>
    </form>
  );
}
