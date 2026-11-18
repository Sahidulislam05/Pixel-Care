import { PhoneCallIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatWindow } from "@/features/chat/components/ChatWindow";

export const metadata: Metadata = {
  title: "AI Assistant",
  description:
    "Describe your symptoms in plain language and get matched with the right verified specialist.",
};

export default function AiAssistantPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI Assistant"
        title={
          <>
            Tell us what's wrong. <em>We'll find who can help.</em>
          </>
        }
        description="Our assistant searches every verified doctor on Pixel-Care, including fees, locations and today's open slots, to suggest who to see."
      />
      <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_300px]">
        <Suspense fallback={<Skeleton className="h-[70vh] min-h-130 w-full" />}>
          <ChatWindow />
        </Suspense>

        <aside className="space-y-4">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5">
            <p className="flex items-center gap-2 font-semibold text-destructive">
              <PhoneCallIcon className="size-4" /> Medical emergency?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              For chest pain, breathing difficulty, heavy bleeding or stroke
              signs, call <strong>999</strong> or go to the nearest hospital
              now.
            </p>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold">
              <SparklesIcon className="size-4 text-highlight" /> What it can do
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              <li>Suggest the right specialization</li>
              <li>Recommend verified doctors with fees</li>
              <li>Show today's open schedules</li>
              <li>Filter by city or area</li>
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="flex items-center gap-2 font-semibold">
              <ShieldCheckIcon className="size-4 text-secondary-foreground" />{" "}
              What it won't do
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              It doesn't diagnose or prescribe medicine. Only a doctor can do
              that during your consultation.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
