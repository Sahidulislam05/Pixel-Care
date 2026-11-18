import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about bookings, payments or joining as a doctor? Send us a message.",
};

export default function ContactPage() {
  const { contact } = siteConfig;
  const channels = [
    {
      icon: MailIcon,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      icon: PhoneIcon,
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/[^+\d]/g, "")}`,
    },
    { icon: MapPinIcon, label: "Office", value: contact.address },
    { icon: ClockIcon, label: "Support hours", value: contact.hours },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            We're here <em>to help</em>
          </>
        }
        description="Questions about a booking, a refund or joining as a doctor? Send a message and our team will get back to you."
      />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="space-y-6">
          <ul className="grid gap-4">
            {channels.map(({ icon: Icon, label, value, href }) => (
              <li
                key={label}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} className="font-medium hover:text-primary">
                      {value}
                    </a>
                  ) : (
                    <p className="font-medium">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Looking for quick answers? Read our{" "}
            <Link
              href="/faq"
              className="font-medium text-primary hover:underline"
            >
              Help & FAQ
            </Link>
            .
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-xs sm:p-8">
          <h2 className="mb-6 text-2xl font-semibold">Send us a message</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
