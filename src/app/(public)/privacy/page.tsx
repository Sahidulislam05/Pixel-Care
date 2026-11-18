import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="How Pixel-Care collects, uses and protects your personal and health information."
      sections={[
        {
          heading: "Information we collect",
          body: "Account details (name, email, phone, address), appointment and payment records, prescriptions written by your doctor, and messages you send to support or the AI assistant.",
        },
        {
          heading: "How we use it",
          body: "To create your account, confirm bookings, send invoices and prescriptions by email, process refunds, and help you find a suitable doctor. We do not sell your data.",
        },
        {
          heading: "Payments",
          body: "Payments are processed by bKash. We store the transaction ID and amount for your records, never your bKash PIN or OTP.",
        },
        {
          heading: "Who can see your records",
          body: "Only you, the doctor you booked, and authorised administrators can view an appointment and its prescription.",
        },
        {
          heading: "AI assistant",
          body: "Chat messages are kept for up to one hour to keep the conversation in context, then deleted. Avoid sharing identifying details in the chat.",
        },
        {
          heading: "Security",
          body: "Passwords are hashed, sessions use secure HTTP-only cookies, and access to every record is checked by role on our servers.",
        },
        {
          heading: "Your choices",
          body: "You can update your profile at any time and contact support to request a copy or deletion of your data.",
        },
      ]}
    />
  );
}
