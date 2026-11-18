"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { authApi } from "../api";
import { meQueryKey } from "../hooks";
import { type RegisterInput, RegisterSchema } from "../schemas";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { OtpForm } from "./OtpForm";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  {
    label: "Upper & lowercase",
    test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { errors } = form.formState;
  const password = form.watch("password");

  const register = useMutation({
    mutationFn: (values: RegisterInput) =>
      authApi.register({
        name: values.name,
        email: values.email,
        password: values.password,
        patient: values.contactNumber
          ? { contactNumber: values.contactNumber }
          : undefined,
      }),
    onSuccess: (_, values) => {
      setPendingEmail(values.email.toLowerCase());
      toast.success("Verification code sent to your email");
    },
  });

  const verify = useMutation({
    mutationFn: (otp: string) =>
      authApi.verifyEmail({ email: pendingEmail ?? "", otp }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: meQueryKey });
      toast.success("Welcome to Pixel-Care! Your account is ready.");
      router.replace("/dashboard");
      router.refresh();
    },
  });

  if (pendingEmail) {
    return (
      <OtpForm
        email={pendingEmail}
        validMinutes={5}
        isLoading={verify.isPending}
        error={verify.isError ? getErrorMessage(verify.error) : null}
        onSubmit={(otp) => verify.mutate(otp)}
        onBack={() => {
          setPendingEmail(null);
          verify.reset();
        }}
      />
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => register.mutate(values))}
      noValidate
      className="grid gap-5"
    >
      {register.isError && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {getErrorMessage(register.error)}
        </p>
      )}
      <FormField
        id="reg-name"
        label="Full name"
        required
        error={errors.name?.message}
      >
        <Input
          {...fieldA11y("reg-name", errors.name?.message)}
          autoComplete="name"
          {...form.register("name")}
        />
      </FormField>
      <FormField
        id="reg-email"
        label="Email"
        required
        error={errors.email?.message}
      >
        <Input
          {...fieldA11y("reg-email", errors.email?.message)}
          type="email"
          autoComplete="email"
          {...form.register("email")}
        />
      </FormField>
      <FormField
        id="reg-phone"
        label="Mobile number"
        error={errors.contactNumber?.message}
        hint="Optional. Lets your doctor reach you."
      >
        <Input
          {...fieldA11y("reg-phone", errors.contactNumber?.message)}
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          {...form.register("contactNumber")}
        />
      </FormField>
      <FormField
        id="reg-password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <PasswordInput
          {...fieldA11y("reg-password", errors.password?.message)}
          autoComplete="new-password"
          {...form.register("password")}
        />
      </FormField>
      <ul
        className="-mt-2 grid grid-cols-2 gap-1.5 text-xs"
        aria-label="Password requirements"
      >
        {PASSWORD_RULES.map((rule) => {
          const isMet = rule.test(password);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5",
                isMet ? "text-secondary-foreground" : "text-muted-foreground",
              )}
            >
              <CheckIcon
                className={cn("size-3.5", !isMet && "opacity-30")}
                aria-hidden="true"
              />
              {rule.label}
              <span className="sr-only">{isMet ? "(met)" : "(not met)"}</span>
            </li>
          );
        })}
      </ul>
      <FormField
        id="reg-confirm"
        label="Confirm password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          {...fieldA11y("reg-confirm", errors.confirmPassword?.message)}
          autoComplete="new-password"
          {...form.register("confirmPassword")}
        />
      </FormField>
      <SubmitButton
        isLoading={register.isPending}
        loadingText="Creating account…"
        size="lg"
      >
        Create account
      </SubmitButton>
      <GoogleSignInButton mode="signup" />
    </form>
  );
}
