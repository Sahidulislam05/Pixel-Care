"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2Icon, FileUpIcon, MailCheckIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SPECIALIZATIONS } from "@/config/site";
import { OtpSchema } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/api-client";
import { doctorsApi } from "../api";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const ApplySchema = z.object({
  name: z.string().trim().min(3, "Enter your full name").max(60),
  email: z.email("Enter a valid email address"),
  specialization: z.string().min(1, "Choose your specialization"),
  licenseNumber: z.string().trim().min(3, "Enter your BMDC licence number"),
  qualifications: z.string().trim().min(2, "e.g. MBBS, FCPS (Medicine)"),
  experienceYears: z.coerce
    .number<string>()
    .int("Whole years only")
    .min(0, "Can't be negative")
    .max(60, "Please check this value"),
  consultationFee: z.coerce
    .number<string>()
    .min(100, "Minimum ৳100")
    .max(20000, "Maximum ৳20,000"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^(\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number"),
  address: z.string().trim().min(5, "e.g. Dhanmondi, Dhaka"),
  bio: z.string().trim().max(1000, "Keep it under 1000 characters").optional(),
  resume: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Upload your resume (PDF)")
    .refine(
      (files) => !files?.[0] || files[0].type === "application/pdf",
      "Resume must be a PDF",
    )
    .refine(
      (files) => !files?.[0] || files[0].size <= MAX_FILE_BYTES,
      "Resume must be under 5 MB",
    ),
});
type ApplyInput = z.input<typeof ApplySchema>;
type ApplyOutput = z.output<typeof ApplySchema>;

export function ApplyDoctorForm() {
  const [step, setStep] = useState<"details" | "otp" | "done">("details");
  const [email, setEmail] = useState("");

  const form = useForm<ApplyInput, unknown, ApplyOutput>({
    resolver: zodResolver(ApplySchema),
    defaultValues: {
      name: "",
      email: "",
      specialization: "",
      licenseNumber: "",
      qualifications: "",
      experienceYears: "",
      consultationFee: "",
      contactNumber: "",
      address: "",
      bio: "",
    },
  });
  const otpForm = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { otp: "" },
  });
  const { errors } = form.formState;

  const apply = useMutation({
    mutationFn: (values: ApplyOutput) => {
      const { resume, name, email: mail, ...doctor } = values;
      const body = new FormData();
      body.append(
        "data",
        JSON.stringify({
          user: { name, email: mail },
          doctor: { ...doctor, bio: doctor.bio || undefined },
        }),
      );
      body.append("resume", resume[0]);
      return doctorsApi.apply(body);
    },
    onSuccess: (_, values) => {
      setEmail(values.email);
      setStep("otp");
      toast.success("We've emailed you a 6-digit code");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const verify = useMutation({
    mutationFn: (otp: string) =>
      doctorsApi.verifyApplicationEmail({ email, otp }),
    onSuccess: () => setStep("done"),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (step === "done") {
    return (
      <output className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2Icon className="size-12 text-secondary-foreground" />
        <h2 className="text-2xl font-semibold">Application submitted</h2>
        <p className="max-w-md text-muted-foreground">
          Our team will review your licence and resume. Once approved, we'll
          email your login password to{" "}
          <strong className="text-foreground">{email}</strong>.
        </p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to home
        </Link>
      </output>
    );
  }

  if (step === "otp") {
    const otpError = otpForm.formState.errors.otp?.message;
    return (
      <form
        onSubmit={otpForm.handleSubmit(({ otp }) => verify.mutate(otp))}
        noValidate
        className="mx-auto grid max-w-sm gap-5 py-4"
      >
        <div className="text-center">
          <MailCheckIcon className="mx-auto size-10 text-primary" />
          <h2 className="mt-3 text-xl font-semibold">Verify your email</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the code sent to{" "}
            <strong className="text-foreground">{email}</strong>. It's valid for
            1 hour.
          </p>
        </div>
        <FormField
          id="apply-otp"
          label="Verification code"
          required
          error={otpError}
        >
          <Input
            {...fieldA11y("apply-otp", otpError)}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className="text-center text-lg tracking-[0.5em]"
            {...otpForm.register("otp")}
          />
        </FormField>
        <SubmitButton isLoading={verify.isPending} loadingText="Verifying…">
          Verify & submit application
        </SubmitButton>
      </form>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) => apply.mutate(values))}
      noValidate
      className="grid gap-6"
    >
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">Personal details</legend>
        <FormField
          id="apply-name"
          label="Full name (as on licence)"
          required
          error={errors.name?.message}
        >
          <Input
            {...fieldA11y("apply-name", errors.name?.message)}
            autoComplete="name"
            placeholder="Dr. Farhana Akter"
            {...form.register("name")}
          />
        </FormField>
        <FormField
          id="apply-email"
          label="Email"
          required
          error={errors.email?.message}
        >
          <Input
            {...fieldA11y("apply-email", errors.email?.message)}
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
        </FormField>
        <FormField
          id="apply-phone"
          label="Mobile number"
          required
          error={errors.contactNumber?.message}
        >
          <Input
            {...fieldA11y("apply-phone", errors.contactNumber?.message)}
            type="tel"
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
            {...form.register("contactNumber")}
          />
        </FormField>
        <FormField
          id="apply-address"
          label="Practice location"
          required
          error={errors.address?.message}
        >
          <Input
            {...fieldA11y("apply-address", errors.address?.message)}
            placeholder="Gulshan 2, Dhaka"
            {...form.register("address")}
          />
        </FormField>
      </fieldset>

      <fieldset className="grid gap-5 border-t pt-6 sm:grid-cols-2">
        <legend className="mb-4 text-lg font-semibold">
          Professional details
        </legend>
        <div className="grid gap-2">
          <Controller
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FilterSelect
                id="apply-specialization"
                label="Specialization *"
                value={field.value || "none"}
                onChange={(value) =>
                  field.onChange(value === "none" ? "" : value)
                }
                options={[
                  { value: "none", label: "Choose specialization" },
                  ...SPECIALIZATIONS.map((s) => ({ value: s, label: s })),
                ]}
              />
            )}
          />
          {errors.specialization && (
            <p role="alert" className="text-sm text-destructive">
              {errors.specialization.message}
            </p>
          )}
        </div>
        <FormField
          id="apply-licence"
          label="BMDC licence number"
          required
          error={errors.licenseNumber?.message}
        >
          <Input
            {...fieldA11y("apply-licence", errors.licenseNumber?.message)}
            placeholder="BMDC-A-12345"
            {...form.register("licenseNumber")}
          />
        </FormField>
        <FormField
          id="apply-qualifications"
          label="Qualifications"
          required
          error={errors.qualifications?.message}
        >
          <Input
            {...fieldA11y(
              "apply-qualifications",
              errors.qualifications?.message,
            )}
            placeholder="MBBS, FCPS (Medicine)"
            {...form.register("qualifications")}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="apply-experience"
            label="Experience (years)"
            required
            error={errors.experienceYears?.message}
          >
            <Input
              {...fieldA11y(
                "apply-experience",
                errors.experienceYears?.message,
              )}
              type="number"
              min={0}
              inputMode="numeric"
              {...form.register("experienceYears")}
            />
          </FormField>
          <FormField
            id="apply-fee"
            label="Fee (৳)"
            required
            error={errors.consultationFee?.message}
          >
            <Input
              {...fieldA11y("apply-fee", errors.consultationFee?.message)}
              type="number"
              min={100}
              inputMode="numeric"
              {...form.register("consultationFee")}
            />
          </FormField>
        </div>
        <FormField
          id="apply-bio"
          label="Short bio"
          error={errors.bio?.message}
          hint="What you treat. Patients and our AI assistant read this."
          className="sm:col-span-2"
        >
          <Textarea
            {...fieldA11y("apply-bio", errors.bio?.message)}
            rows={4}
            {...form.register("bio")}
          />
        </FormField>
        <FormField
          id="apply-resume"
          label="Resume / CV (PDF, max 5 MB)"
          required
          error={errors.resume?.message as string | undefined}
          className="sm:col-span-2"
        >
          <label
            htmlFor="apply-resume"
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed bg-muted/40 p-4 text-sm transition-colors hover:border-primary/50 hover:bg-accent/40"
          >
            <FileUpIcon className="size-5 text-primary" />
            <span>
              {form.watch("resume")?.[0]?.name ?? "Choose a PDF file"}
            </span>
          </label>
          <input
            {...fieldA11y(
              "apply-resume",
              errors.resume?.message as string | undefined,
            )}
            type="file"
            accept="application/pdf"
            className="sr-only"
            {...form.register("resume")}
          />
        </FormField>
      </fieldset>

      <SubmitButton
        isLoading={apply.isPending}
        loadingText="Uploading application…"
        size="lg"
        className="sm:w-fit"
      >
        Submit application
      </SubmitButton>
    </form>
  );
}
