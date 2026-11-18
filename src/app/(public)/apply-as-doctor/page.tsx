import {
  BadgeCheckIcon,
  CalendarClockIcon,
  FileSignatureIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ApplyDoctorForm } from "@/features/doctors/components/ApplyDoctorForm";

export const metadata: Metadata = {
  title: "Join as a Doctor",
  description:
    "Apply to consult patients on Pixel-Care. Set your schedule and fee, and write digital prescriptions.",
};

const PERKS = [
  {
    icon: CalendarClockIcon,
    text: "Publish a schedule any day; slots are split into 20-minute consultations automatically.",
  },
  {
    icon: FileSignatureIcon,
    text: "Write prescriptions online. Patients receive them as PDFs instantly.",
  },
  {
    icon: BadgeCheckIcon,
    text: "A verified badge after our team reviews your licence and resume.",
  },
];

export default function ApplyAsDoctorPage() {
  return (
    <>
      <PageHeader
        eyebrow="For doctors"
        title={
          <>
            Consult patients <em>across Bangladesh</em>
          </>
        }
        description="Apply in a few minutes. After you verify your email, our team reviews your application and sends your login by email."
      />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
          <ApplyDoctorForm />
        </div>
        <aside className="space-y-4">
          {PERKS.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex gap-3 rounded-xl border bg-secondary/50 p-5"
            >
              <Icon className="size-5 shrink-0 text-secondary-foreground" />
              <p className="text-sm">{text}</p>
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
