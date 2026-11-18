// Central place for site-wide copy and links. Update contact/social values to your own.
export const siteConfig = {
  name: "Pixel-Care",
  tagline: "Verified doctors, booked in minutes.",
  description:
    "Find verified BMDC-registered doctors, book a same-day video consultation, pay securely with bKash, and get your prescription by email.",
  contact: {
    email: "support@pixelcare.com.bd",
    phone: "+880 1700-000000",
    address: "Dhaka, Bangladesh",
    hours: "Every day, 8:00 AM – 11:00 PM",
  },
  social: {
    github: "https://github.com",
    linkedin: "https://www.linkedin.com",
    facebook: "https://www.facebook.com",
  },
} as const;

export const publicNavLinks = [
  { href: "/", label: "Home" },
  { href: "/doctors", label: "Find Doctors" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = {
  Platform: [
    { href: "/doctors", label: "Find Doctors" },
    { href: "/doctors?available=today", label: "Available Today" },
    { href: "/ai-assistant", label: "AI Assistant" },
    { href: "/apply-as-doctor", label: "Join as a Doctor" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "Help & FAQ" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;

// Specializations offered on the platform (matches backend doctor data).
export const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "Neurology",
  "Orthopedics",
  "Psychiatry",
  "ENT",
  "Ophthalmology",
  "Endocrinology",
  "Gastroenterology",
  "Pulmonology",
  "Nephrology",
  "Urology",
  "Oncology",
  "Hematology",
  "Hepatology",
  "Rheumatology",
  "Internal Medicine",
  "Family Medicine",
  "Infectious Disease",
  "Dentistry",
  "General Surgery",
  "Neurosurgery",
  "Cardiac Surgery",
  "Plastic Surgery",
  "Pediatric Surgery",
  "Neonatology",
  "Geriatrics",
  "Allergy & Immunology",
  "Sports Medicine",
  "Pain Medicine",
  "Physical Medicine & Rehabilitation",
  "Nutrition & Dietetics",
] as const;
