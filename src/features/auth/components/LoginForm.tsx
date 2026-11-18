"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldIcon, StethoscopeIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { publicEnv } from "@/config/env";
import { getErrorMessage } from "@/lib/api-client";
import { useLogin } from "../hooks";
import { type LoginInput, LoginSchema } from "../schemas";
import { GoogleSignInButton } from "./GoogleSignInButton";

const DEMO_ACCOUNTS = [
  {
    key: "patient",
    label: "Patient",
    icon: UserIcon,
    ...publicEnv.demo.patient,
  },
  {
    key: "doctor",
    label: "Doctor",
    icon: StethoscopeIcon,
    ...publicEnv.demo.doctor,
  },
  { key: "admin", label: "Admin", icon: ShieldIcon, ...publicEnv.demo.admin },
].filter((account) => account.email && account.password);

export function LoginForm() {
  const searchParams = useSearchParams();
  const login = useLogin(searchParams.get("next"));
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => login.mutate(values));

  const signInWithDemo = (email: string, password: string) => {
    form.setValue("email", email, { shouldValidate: true });
    form.setValue("password", password, { shouldValidate: true });
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        {login.isError && (
          <p
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
          >
            {getErrorMessage(login.error)}
          </p>
        )}
        <FormField
          id="login-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            {...fieldA11y("login-email", errors.email?.message)}
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
        </FormField>
        <FormField
          id="login-password"
          label="Password"
          required
          error={errors.password?.message}
        >
          <PasswordInput
            {...fieldA11y("login-password", errors.password?.message)}
            autoComplete="current-password"
            {...form.register("password")}
          />
        </FormField>
        <div className="-mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton
          isLoading={login.isPending}
          loadingText="Signing in…"
          size="lg"
        >
          Sign in
        </SubmitButton>
      </form>

      <GoogleSignInButton redirectTo={searchParams.get("next")} />

      {DEMO_ACCOUNTS.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> Try a demo account{" "}
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(
              ({ key, label, icon: Icon, email, password }) => (
                <Button
                  key={key}
                  type="button"
                  variant="outline"
                  disabled={login.isPending}
                  onClick={() => signInWithDemo(email, password)}
                >
                  <Icon /> {label}
                </Button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
