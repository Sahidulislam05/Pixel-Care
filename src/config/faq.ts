// Answers reflect the platform's actual rules (see backend Project Requirements).
export const FAQ_ITEMS = [
  {
    q: "How do I book an appointment?",
    a: "Open a doctor's profile, pick one of today's open schedules and pay with bKash. As soon as the payment succeeds, your appointment is confirmed with a serial number and joining time, and the invoice is emailed to you.",
  },
  {
    q: "Can I book for a future date?",
    a: "Not yet. Patients see only today's schedules, and only until each schedule starts. Doctors publish their schedules day by day, so check back the same day you want to consult.",
  },
  {
    q: "What is the cancellation and refund policy?",
    a: "Cancel more than 1 hour before the schedule's start time and your bKash payment is refunded automatically. You can still cancel later, but without a refund.",
  },
  {
    q: "How do I join the video consultation?",
    a: "Your invoice email and your dashboard both show the meeting link and your joining time. Each patient gets a 20-minute slot in serial order.",
  },
  {
    q: "Where do I get my prescription?",
    a: "Once the doctor marks the consultation as completed and writes the prescription, a PDF is emailed to you and is available from My Appointments.",
  },
  {
    q: "Is the AI assistant a doctor?",
    a: "No. It helps you choose a specialization and suggests real doctors from our platform. It never diagnoses or prescribes. In an emergency, go to the nearest hospital or call 999.",
  },
  {
    q: "I'm a doctor. How can I join?",
    a: "Apply from the 'Join as a Doctor' page with your BMDC licence number and resume, then verify your email. Our team reviews the application, and once approved, your login password is emailed to you.",
  },
] as const;
