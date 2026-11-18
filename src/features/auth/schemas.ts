import { z } from "zod";

// Same rules as the API (auth.validation.ts) so users see errors before submitting.
export const StrongPasswordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number")
  .regex(/[^A-Za-z0-9]/, "Add a symbol (e.g. @ # !)");

export const EmailSchema = z.email("Enter a valid email address");

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name is too long"),
    email: EmailSchema,
    contactNumber: z
      .string()
      .trim()
      .regex(
        /^(\+?88)?01[3-9]\d{8}$/,
        "Enter a valid Bangladeshi mobile number",
      )
      .or(z.literal("")),
    password: StrongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const OtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
});
export type OtpInput = z.infer<typeof OtpSchema>;

export const ForgotPasswordSchema = z.object({ email: EmailSchema });
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
  .object({
    otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your email"),
    newPassword: StrongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: StrongPasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
