import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/shared/FaqList";
import { PageHeader } from "@/components/shared/PageHeader";
import { FAQ_ITEMS } from "@/config/faq";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description:
    "Answers about booking, payments, refunds, prescriptions and the AI assistant.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Help & FAQ"
        title={
          <>
            Everything you <em>need to know</em>
          </>
        }
        description="How booking, payments, refunds and prescriptions work on Pixel-Care."
      />
      <section className="container-page max-w-3xl py-12">
        <FaqList items={FAQ_ITEMS} />
        <p className="mt-8 text-center text-muted-foreground">
          Didn't find your answer?{" "}
          <Link
            href="/contact"
            className="font-medium text-primary hover:underline"
          >
            Contact our team
          </Link>
          .
        </p>
      </section>
    </>
  );
}
