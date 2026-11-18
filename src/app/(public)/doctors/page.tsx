import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  DOCTOR_GRID,
  DoctorCardSkeleton,
} from "@/features/doctors/components/DoctorCard";
import { DoctorExplorer } from "@/features/doctors/components/DoctorExplorer";

export const metadata: Metadata = {
  title: "Find a Doctor",
  description:
    "Search verified doctors by specialization, fee and experience, and book a same-day video consultation.",
};

export default function DoctorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Find doctors"
        title={
          <>
            The right specialist, <em>without the waiting room</em>
          </>
        }
        description="Every doctor here is BMDC-registered and reviewed by our team. Filter by what matters to you and book a slot for today."
      />
      <section className="container-page py-10">
        <Suspense
          fallback={
            <div className={DOCTOR_GRID}>
              {Array.from({ length: 8 }, (_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <DoctorExplorer />
        </Suspense>
      </section>
    </>
  );
}
