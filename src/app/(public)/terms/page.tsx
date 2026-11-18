import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="The rules that apply when you use Pixel-Care as a patient or a doctor."
      sections={[
        {
          heading: "Not for emergencies",
          body: "Pixel-Care is for non-emergency consultations. In an emergency, call 999 or go to the nearest hospital.",
        },
        {
          heading: "Bookings",
          body: "Appointments can be booked only for today's published schedules, before each schedule starts. A booking is confirmed once the bKash payment succeeds.",
        },
        {
          heading: "Cancellations and refunds",
          body: "Cancelling more than 1 hour before the schedule's start time refunds your payment in full. Later cancellations are allowed but not refunded.",
        },
        {
          heading: "Consultations",
          body: "Join on time using the meeting link in your invoice. Each patient has a 20-minute slot in serial order.",
        },
        {
          heading: "Doctors",
          body: "Doctors must hold a valid BMDC licence, keep their profile accurate, and are responsible for the medical advice and prescriptions they give.",
        },
        {
          heading: "AI assistant",
          body: "The assistant only helps you choose a doctor. It does not provide diagnosis or treatment and is not a substitute for professional advice.",
        },
        {
          heading: "Accounts",
          body: "Keep your login details private. Accounts that misuse the platform may be blocked by an administrator.",
        },
      ]}
    />
  );
}
