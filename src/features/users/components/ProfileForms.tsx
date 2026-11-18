"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { FormField, fieldA11y } from "@/components/forms/FormField";
import { PasswordInput } from "@/components/forms/PasswordInput";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { roleLabel } from "@/config/dashboard-nav";
import { authApi } from "@/features/auth/api";
import { meQueryKey } from "@/features/auth/hooks";
import {
  type ChangePasswordInput,
  ChangePasswordSchema,
} from "@/features/auth/schemas";
import { doctorsApi } from "@/features/doctors/api";
import { getErrorMessage } from "@/lib/api-client";
import type { Me } from "@/types/api";
import { usersApi } from "../api";

const PHONE = /^(\+?88)?01[3-9]\d{8}$/;

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 rounded-xl border bg-card p-6 shadow-xs lg:grid-cols-[260px_1fr]">
      <div>
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </section>
  );
}

export function AvatarUpload({ me }: { me: Me }) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useMutation({
    mutationFn: usersApi.uploadAvatar,
    onSuccess: () => {
      toast.success("Profile photo updated");
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border bg-card p-6 shadow-xs sm:flex-row sm:items-center">
      <div className="relative">
        <UserAvatar
          name={me.name}
          imageUrl={me.imageUrl}
          className="size-20 text-xl"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
          aria-label="Change profile photo"
        >
          {upload.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <CameraIcon className="size-4" />
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          aria-label="Profile photo file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            if (file.size > 5 * 1024 * 1024)
              return toast.error("Image must be under 5 MB");
            upload.mutate(file);
          }}
        />
      </div>
      <div>
        <p className="text-xl font-semibold">{me.name}</p>
        <p className="text-sm text-muted-foreground">
          {me.email} · {roleLabel[me.role]}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG or WebP, up to 5 MB.
        </p>
      </div>
    </div>
  );
}

const ProfileSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(50),
  contactNumber: z
    .string()
    .trim()
    .regex(PHONE, "Enter a valid Bangladeshi mobile number")
    .or(z.literal("")),
  address: z.string().trim().max(200).optional(),
});
type ProfileInput = z.infer<typeof ProfileSchema>;

export function ProfileDetailsForm({ me }: { me: Me }) {
  const queryClient = useQueryClient();
  const profile = me.patient ?? me.doctor;
  const form = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: me.name,
      contactNumber: profile?.contactNumber ?? "",
      address: profile?.address ?? "",
    },
  });
  const { errors, isDirty } = form.formState;
  const hasProfile = Boolean(profile);

  const save = useMutation({
    mutationFn: (values: ProfileInput) =>
      usersApi.updateMe({
        name: values.name,
        ...(hasProfile && values.contactNumber
          ? { contactNumber: values.contactNumber }
          : {}),
        ...(hasProfile && values.address ? { address: values.address } : {}),
      }),
    onSuccess: (_, values) => {
      toast.success("Profile updated");
      form.reset(values);
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <SectionCard
      title="Personal information"
      description="Your name appears on bookings, invoices and prescriptions."
    >
      <form
        onSubmit={form.handleSubmit((v) => save.mutate(v))}
        noValidate
        className="grid gap-4 sm:grid-cols-2"
      >
        <FormField
          id="pf-name"
          label="Full name"
          required
          error={errors.name?.message}
        >
          <Input
            {...fieldA11y("pf-name", errors.name?.message)}
            autoComplete="name"
            {...form.register("name")}
          />
        </FormField>
        <FormField
          id="pf-email"
          label="Email"
          hint="Contact support to change your email."
        >
          <Input
            id="pf-email"
            value={me.email}
            disabled
            aria-describedby="pf-email-message"
          />
        </FormField>
        {hasProfile && (
          <>
            <FormField
              id="pf-phone"
              label="Mobile number"
              error={errors.contactNumber?.message}
            >
              <Input
                {...fieldA11y("pf-phone", errors.contactNumber?.message)}
                type="tel"
                autoComplete="tel"
                {...form.register("contactNumber")}
              />
            </FormField>
            <FormField
              id="pf-address"
              label="Address"
              error={errors.address?.message}
            >
              <Input
                {...fieldA11y("pf-address", errors.address?.message)}
                autoComplete="street-address"
                {...form.register("address")}
              />
            </FormField>
          </>
        )}
        <div className="sm:col-span-2">
          <SubmitButton
            isLoading={save.isPending}
            loadingText="Saving…"
            disabled={!isDirty}
          >
            Save changes
          </SubmitButton>
        </div>
      </form>
    </SectionCard>
  );
}

const DoctorPracticeSchema = z.object({
  consultationFee: z.coerce
    .number<string>()
    .min(100, "Minimum ৳100")
    .max(20000, "Maximum ৳20,000"),
  bio: z.string().trim().max(1000, "Keep it under 1000 characters"),
});
type DoctorPracticeInput = z.input<typeof DoctorPracticeSchema>;
type DoctorPracticeOutput = z.output<typeof DoctorPracticeSchema>;

export function DoctorPracticeForm({ me }: { me: Me }) {
  const queryClient = useQueryClient();
  const form = useForm<DoctorPracticeInput, unknown, DoctorPracticeOutput>({
    resolver: zodResolver(DoctorPracticeSchema),
    defaultValues: {
      consultationFee: me.doctor?.consultationFee ?? "",
      bio: me.doctor?.bio ?? "",
    },
  });
  const { errors, isDirty } = form.formState;

  const save = useMutation({
    mutationFn: (values: DoctorPracticeOutput) =>
      doctorsApi.updateMyProfile({
        consultationFee: values.consultationFee,
        bio: values.bio || undefined,
      }),
    onSuccess: () => {
      toast.success(
        "Practice details updated. The AI assistant will use your new bio.",
      );
      form.reset(form.getValues());
      queryClient.invalidateQueries({ queryKey: meQueryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <SectionCard
      title="Practice details"
      description="Shown on your public profile and used by the AI assistant to match patients."
    >
      <form
        onSubmit={form.handleSubmit((v) => save.mutate(v))}
        noValidate
        className="grid gap-4"
      >
        <FormField
          id="dr-fee"
          label="Consultation fee (৳)"
          required
          error={errors.consultationFee?.message}
          className="sm:max-w-xs"
        >
          <Input
            {...fieldA11y("dr-fee", errors.consultationFee?.message)}
            type="number"
            min={100}
            {...form.register("consultationFee")}
          />
        </FormField>
        <FormField
          id="dr-bio"
          label="Bio"
          error={errors.bio?.message}
          hint="Conditions you treat and your approach."
        >
          <Textarea
            {...fieldA11y("dr-bio", errors.bio?.message)}
            rows={5}
            {...form.register("bio")}
          />
        </FormField>
        <SubmitButton
          isLoading={save.isPending}
          loadingText="Saving…"
          disabled={!isDirty}
          className="w-fit"
        >
          Save practice details
        </SubmitButton>
      </form>
    </SectionCard>
  );
}

export function ChangePasswordForm({ me }: { me: Me }) {
  // Google-only patients have no password yet; this sets one.
  const isSettingPassword = me.authProvider === "GOOGLE";
  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const { errors } = form.formState;

  const change = useMutation({
    mutationFn: (values: ChangePasswordInput) =>
      authApi.changePassword({
        currentPassword: values.currentPassword || undefined,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success("Password updated");
      form.reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <SectionCard
      title={isSettingPassword ? "Set a password" : "Change password"}
      description={
        isSettingPassword
          ? "Add a password so you can also sign in with email."
          : "Use at least 8 characters with upper & lowercase letters, a number and a symbol."
      }
    >
      <form
        onSubmit={form.handleSubmit((v) => change.mutate(v))}
        noValidate
        className="grid gap-4 sm:max-w-md"
      >
        {!isSettingPassword && (
          <FormField
            id="cp-current"
            label="Current password"
            required
            error={errors.currentPassword?.message}
          >
            <PasswordInput
              {...fieldA11y("cp-current", errors.currentPassword?.message)}
              autoComplete="current-password"
              {...form.register("currentPassword")}
            />
          </FormField>
        )}
        <FormField
          id="cp-new"
          label="New password"
          required
          error={errors.newPassword?.message}
        >
          <PasswordInput
            {...fieldA11y("cp-new", errors.newPassword?.message)}
            autoComplete="new-password"
            {...form.register("newPassword")}
          />
        </FormField>
        <FormField
          id="cp-confirm"
          label="Confirm new password"
          required
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            {...fieldA11y("cp-confirm", errors.confirmPassword?.message)}
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
        </FormField>
        <SubmitButton
          isLoading={change.isPending}
          loadingText="Updating…"
          className="w-fit"
        >
          Update password
        </SubmitButton>
      </form>
    </SectionCard>
  );
}
