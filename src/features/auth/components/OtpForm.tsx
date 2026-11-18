"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { type OtpInput, OtpSchema } from "../schemas";

type OtpFormProps = {
  email: string;
  validMinutes: number;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (otp: string) => void;
  onBack: () => void;
};

export function OtpForm({
  email,
  validMinutes,
  isLoading,
  error,
  onSubmit,
  onBack,
}: OtpFormProps) {
  const form = useForm<OtpInput>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });
  const fieldError = form.formState.errors.otp?.message;

  return (
    <form
      onSubmit={form.handleSubmit(({ otp }) => onSubmit(otp))}
      noValidate
      className="grid gap-5"
    >
      <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground">
        <MailCheckIcon className="mb-2 size-5" />
        We sent a 6-digit code to <strong>{email}</strong>. It expires in{" "}
        {validMinutes} minutes.
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <FormField id="otp" label="Verification code" required error={fieldError}>
        <Input
          {...fieldA11y("otp", fieldError)}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
          className="h-12 text-center text-xl tracking-[0.6em]"
          {...form.register("otp")}
        />
      </FormField>
      <SubmitButton isLoading={isLoading} loadingText="Verifying…" size="lg">
        Verify email
      </SubmitButton>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Use a different email
      </button>
    </form>
  );
}
