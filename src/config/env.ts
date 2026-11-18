import { z } from "zod";

// NEXT_PUBLIC_* values must be referenced literally so Next.js can inline them.
const PublicEnvSchema = z.object({
  siteUrl: z.url().default("http://localhost:3000"),
  // Empty hides the Google button.
  googleClientId: z
    .string()
    .regex(/^$|\.apps\.googleusercontent\.com$/, "Invalid Google client ID"),
  demo: z.object({
    patient: z.object({ email: z.string(), password: z.string() }),
    doctor: z.object({ email: z.string(), password: z.string() }),
    admin: z.object({ email: z.string(), password: z.string() }),
  }),
});

export const publicEnv = PublicEnvSchema.parse({
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  googleClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
  demo: {
    patient: {
      email: process.env.NEXT_PUBLIC_DEMO_PATIENT_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEMO_PATIENT_PASSWORD ?? "",
    },
    doctor: {
      email: process.env.NEXT_PUBLIC_DEMO_DOCTOR_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEMO_DOCTOR_PASSWORD ?? "",
    },
    admin: {
      email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
      password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
    },
  },
});

// Server-only: where Server Components reach the Express API directly.
export const getBackendUrl = () =>
  process.env.BACKEND_URL ?? "http://localhost:5000";
