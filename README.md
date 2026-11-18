# Pixel-Care

> Verified doctors, booked in minutes.

The web app for **Pixel-Care**, an online doctor-consultation platform for Bangladesh. Patients find a BMDC-verified specialist, book a same-day video consultation, pay with **bKash**, and receive their invoice and prescription by email. A **RAG-powered AI assistant** helps patients choose the right doctor in plain language.

Built with **Next.js 16** (App Router, Cache Components), **React 19**, **Tailwind CSS v4** and **shadcn/ui on Base UI**. It is the client for the [Pixel-Care backend](../Pixel-Care-Backend/README.md) (Express, PostgreSQL + pgvector, Redis).

---

## Contents

1. [Highlights](#highlights)
2. [Design system](#design-system)
3. [Tech stack](#tech-stack)
4. [Getting started](#getting-started)
5. [Environment variables](#environment-variables)
6. [Demo accounts](#demo-accounts)
7. [Scripts](#scripts)
8. [Routes](#routes)
9. [Project structure](#project-structure)
10. [Architecture](#architecture)
11. [Accessibility, performance and responsiveness](#accessibility-performance-and-responsiveness)
12. [Quality checks](#quality-checks)
13. [Deployment](#deployment)
14. [Troubleshooting](#troubleshooting)
15. [Requirements checklist](#requirements-checklist)

---

## Highlights

| Area | What you get |
|---|---|
| **Home** | Editorial hero with a rotating specialty word, animated heartbeat line, live platform numbers and today's open slots; two-row specialty marquee; live "available today" doctors; animated timeline; AI showcase; bento trust grid; FAQ; call to action |
| **Find doctors** | Search plus filters (specialization, fee range, experience, available today), 5 sort orders, pagination, skeleton loaders. Filters live in the URL, so results are shareable |
| **Doctor profile** | Server-rendered for SEO, key information, today's bookable schedules with one-click bKash checkout, related specialists |
| **AI assistant** | Chat over the RAG API with session memory; suggested doctors link to their profiles; understands locations ("cardiologist in Sylhet") |
| **Auth** | Email/password with OTP verification, Google sign-in (patients), demo accounts, forgot/reset password, change or set password |
| **Dashboards** | Role-aware sidebar (Patient 6, Doctor 4, Admin 7 items), stat cards, bar, line and pie charts from live analytics, sortable and filterable tables |
| **Patient** | Appointments (pay, cancel with automatic refund rules, join link, prescription PDF), payments, profile and photo |
| **Doctor** | Schedules (create, edit, publish, delete with the platform's rules), consultations (start, complete), digital prescriptions |
| **Admin** | Doctor applications (approve, or reject with a reason), users (search, filter, sort, block/unblock), create admins, all appointments and payments, contact inbox |
| **Pages** | About, Contact (saved to the database), Help & FAQ, Privacy Policy, Terms, Join as a Doctor, custom 404 and error pages |

---

## Design system

The look is **"clinical editorial"**: calm and trustworthy like healthcare, but with the personality of a well-set magazine rather than a stock template.

### Colour psychology

Three brand colours plus one neutral, defined once as tokens in [`src/app/globals.css`](src/app/globals.css).

| Token | Colour | Meaning and use |
|---|---|---|
| `primary` | **Teal** | Trust (blue) + health (green). Main actions, brand, links |
| `secondary` | **Mint** | Reassurance. Availability, success, completed states |
| `highlight` | **Coral** | Warmth and human care. Draws the eye without the alarm of red: AI assistant, pending items, headline accents |
| neutral | **Ink & warm paper** | Deep ink text on a warm off-white "paper" background in light mode, deep navy (not pure black) in dark mode to reduce eye strain |

- Red is reserved for errors and destructive actions.
- **Every text/background pair meets WCAG AA in both themes.** Contrast was measured in the browser: for example coral on paper is 4.98:1, and muted text on paper 6.2:1 (light) and 7.6:1 (dark).
- [`StatusBadge.tsx`](src/components/shared/StatusBadge.tsx) maps every status to a colour by meaning (mint = done, teal = active, coral = needs attention, red = failed).

### Typography

| Role | Font | Where |
|---|---|---|
| Display | **Instrument Serif** (incl. italic) | Large headlines; *italic coral* accents via `<em>` |
| Interface | **Geist** | Body, forms, navigation |
| Figures | **Geist Mono** | Fees, counts, times, small labels |

All fonts are self-hosted through `next/font` (no layout shift, no third-party requests at runtime).

### Shape, texture and motion

- **One radius everywhere** (`--radius: 0.75rem`, i.e. `rounded-xl`) and an 8px spacing grid.
- **Texture:** a fine dot grid (`.bg-dots`) and subtle film grain (`.grain`) replace generic gradient blobs.
- **Signature motif:** an animated ECG heartbeat line ([`EcgLine.tsx`](src/components/shared/EcgLine.tsx)) that draws itself and then pulses.
- **Motion**, all in CSS:
  - **Scroll reveals** with CSS scroll-driven animations (`animation-timeline: view()`). No JavaScript runs, and where unsupported content simply appears without animation, so it is never hidden.
  - **Hero:** a rotating specialty word and floating cards.
  - **Specialties:** infinite marquees that pause on hover.
  - **Timeline:** a connector line that draws itself as you scroll.
  - **AI showcase:** a rotating conic-gradient border.
  - **Cards:** hover lifts.
- **`prefers-reduced-motion`** disables all of it.
- **Dark mode:** follows the system or a manual toggle, with no flash on load.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16.4 (App Router, Turbopack, Cache Components, Partial Prefetching) |
| UI | React 19, Tailwind CSS v4, shadcn/ui (Base UI primitives), lucide-react |
| Server data | TanStack Query 5 |
| Client state | Zustand (AI chat session) |
| Forms | React Hook Form + Zod 4 (schemas mirror the API's validation) |
| Charts | Recharts 3 |
| Theming / toasts | next-themes, Sonner |
| Tooling | TypeScript 5, Biome (lint + format) |

---

## Getting started

### Prerequisites

- Node.js **20 or newer**
- The backend running (default `http://localhost:5000`). See the backend README.

### Install and run

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run dev
```

Open **http://localhost:3000**.

---

## Environment variables

Defined and validated in [`src/config/env.ts`](src/config/env.ts). See [`.env.example`](.env.example).

| Variable | Required | Description |
|---|:---:|---|
| `BACKEND_URL` | ✅ | Express API origin, **server-side only**. The browser calls `/api/v1/*` on this app, which Next.js rewrites to the API, so auth cookies are first-party and no CORS setup is needed. |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Public URL of this app (metadata / Open Graph). |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | | Google OAuth **Web** Client ID (same value as the backend's `GOOGLE_CLIENT_ID`). Empty hides Google sign-in. |
| `NEXT_PUBLIC_DEMO_PATIENT_EMAIL` / `_PASSWORD` | | Demo patient for the "Try a demo account" button |
| `NEXT_PUBLIC_DEMO_DOCTOR_EMAIL` / `_PASSWORD` | | Demo doctor |
| `NEXT_PUBLIC_DEMO_ADMIN_EMAIL` / `_PASSWORD` | | Demo admin |

`NEXT_PUBLIC_*` values are embedded in the browser bundle at build time. Only put demo credentials there, never real ones.

### Google sign-in setup

1. Google Cloud Console → **APIs & Services → Credentials** → your OAuth 2.0 **Web** client.
2. Under **Authorized JavaScript origins**, add every origin that serves this app (e.g. `http://localhost:3000`, `https://your-domain.com`). No redirect URI is needed: the button uses Google's popup flow.
3. Use the same Client ID here and in the backend.

Google sign-in is **patient-only**. It creates a patient on first use, or links to an existing patient with the same verified email. Doctor and admin emails get a clear "use email and password" message.

---

## Demo accounts

The backend seeds these accounts at startup from its `TESTER_*` variables. Put the same values in this app's `NEXT_PUBLIC_DEMO_*` variables and the login page shows one-click buttons:

| Button | Role | Lands on |
|---|---|---|
| Patient | `PATIENT` | Patient overview |
| Doctor | `DOCTOR` | Doctor overview |
| Admin | `ADMIN` | Admin overview |

The demo patient uses a non-deliverable `.test` email domain, so demo invoices never reach a real inbox.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Development server (Turbopack) at http://localhost:3000 |
| `npm run build` | Production build (type-checks, prerenders 24 routes) |
| `npm start` | Serve the production build |
| `npm run lint` | Biome lint **and** format check (`biome check`) |
| `npm run format` | Format all files with Biome |

---

## Routes

Legend: 🌐 public · 🔐 signed-in · 🧑 patient · 🩺 doctor · 🛡️ admin / super admin

| Route | Access | Purpose |
|---|:---:|---|
| `/` | 🌐 | Home |
| `/doctors` | 🌐 | Find doctors: search, filter, sort, paginate (`?q=&specialization=&fee=&experience=&sort=&available=today&page=`) |
| `/doctors/[doctorId]` | 🌐 | Doctor profile and booking (server-rendered) |
| `/ai-assistant` | 🌐 | AI chat (`?q=` starts the conversation with a question) |
| `/about`, `/contact`, `/faq`, `/privacy`, `/terms` | 🌐 | Information pages; Contact saves messages to the database |
| `/apply-as-doctor` | 🌐 | Doctor application with resume upload and email OTP |
| `/login`, `/register`, `/forgot-password` | 🌐 | Auth (signed-in users are redirected to the dashboard) |
| `/dashboard` | 🔐 | Role-specific overview with stat cards and charts |
| `/dashboard/appointments` | 🔐 | Patient: own bookings · Doctor: consultations · Admin: all |
| `/dashboard/payments` | 🧑 🛡️ | Payment history |
| `/dashboard/schedules` | 🩺 | Create, edit, publish and delete schedules |
| `/dashboard/doctors` | 🛡️ | Doctor applications and directory |
| `/dashboard/users` | 🛡️ | Users, block/unblock, create admins |
| `/dashboard/messages` | 🛡️ | Contact-form inbox |
| `/dashboard/profile` | 🔐 | Profile, photo, password (doctors also edit fee and bio) |
| `/dashboard/my-appointments` | 🔐 | Redirects to `/dashboard/appointments`, keeping `?status=`. This is where the bKash callback lands. |

---

## Project structure

```
src/
├── app/                          # Routing only: thin pages and layouts
│   ├── (public)/                 # Floating navbar + footer layout
│   ├── (auth)/                   # Split-screen auth layout
│   ├── dashboard/                # Role-aware dashboard (session-gated)
│   ├── layout.tsx                # Fonts, metadata, providers
│   ├── providers.tsx             # TanStack Query, theme, toasts
│   ├── globals.css               # Design tokens, motion system
│   ├── not-found.tsx · error.tsx
├── features/                     # One folder per feature: api, hooks, schemas, components
│   ├── auth/                     # Login, register, OTP, Google, password flows
│   ├── doctors/                  # Explorer, cards, profile queries, application, admin table
│   ├── appointments/             # Booking, tables, prescription, payments
│   ├── schedules/                # Doctor schedule management
│   ├── analytics/                # Stat cards, charts
│   ├── chat/                     # AI assistant (Zustand session store)
│   ├── users/                    # Admin users, messages, profile forms
│   ├── contact/  home/  dashboard/
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Input, Dialog, Table, Select…)
│   ├── layout/                   # Navbar, Footer, UserMenu, ThemeToggle, Logo
│   ├── shared/                   # SectionHeading, PageHeader, EcgLine, Marquee, Pagination, data-table…
│   └── forms/                    # FormField, PasswordInput, SubmitButton
├── config/                       # env (Zod-validated), site, dashboard-nav, faq
├── hooks/                        # useUrlState, useDebouncedValue
├── lib/                          # api-client (auto token refresh), format helpers
├── types/                        # API and domain types
└── proxy.ts                      # Route guard (Next 16's replacement for middleware)
```

---

## Architecture

```
Browser ──► Next.js app (this repo)
              ├─ /api/v1/*  ── rewrite ──► Express API ──► PostgreSQL / Redis / bKash / OpenRouter
              ├─ proxy.ts   (route guard: session + role, no network calls)
              └─ Server Components ── fetch ("use cache") ──► Express API   (doctor profile, SEO)
```

- **Data fetching:**
  - Lists and dashboards use TanStack Query in client components with skeleton states.
  - The doctor profile is fetched in a Server Component with `"use cache"` + `cacheLife("minutes")`, for SEO and speed.
  - With Cache Components on, any client component that queries during first render sits inside `<Suspense>`, as Next 16 requires.
- **Authentication:**
  - The API sets httpOnly `accessToken` / `refreshToken` cookies, first-party thanks to the rewrite.
  - [`api-client.ts`](src/lib/api-client.ts) refreshes an expired access token once and retries. Concurrent requests share one refresh.
  - [`proxy.ts`](src/proxy.ts) redirects signed-out visitors and blocks pages a role can't use.
  - Inside the dashboard, [`RequireUser`](src/features/dashboard/components/RequireUser.tsx) renders page content only once the session is known.
  - The API still authorises every request. The frontend checks are for UX only.
- **Safe redirects:** `?next=` after login only accepts same-site paths (`//evil.com` and `https://…` fall back to `/dashboard`).
- **Payments:**
  1. "Book & pay" creates a pending appointment and redirects to bKash.
  2. bKash calls the API's callback; the API verifies the payment and redirects to `/dashboard/my-appointments?status=success|failure|cancel|full|error`.
  3. The Appointments page shows the matching message once.
- **Forms:** React Hook Form + Zod schemas that mirror the API. Labels are linked to inputs, and errors are announced through `aria-describedby` and `role="alert"`. Every form has loading, success and error states.

---

## Accessibility, performance and responsiveness

- **Accessibility:**
  - Semantic landmarks and a skip link.
  - `aria-current` in navigation and `aria-sort` on sortable columns.
  - Keyboard-accessible menus, dialogs and native `<details>` FAQs.
  - Decorative motion and graphics are hidden from assistive tech.
  - The rotating headline reads as one sentence to screen readers.
- **Performance:**
  - Static shells for 23 of 24 routes; the doctor profile is a partial prerender.
  - Self-hosted fonts, `next/image` with responsive `sizes`, and Cloudinary images.
  - CSS-only animations with no animation library.
  - Debounced search and `keepPreviousData` to avoid flicker while paging.
- **Responsiveness:** tested at 375px, 768px and 1280px with no horizontal page overflow. Wide tables scroll inside their own card, and navigation collapses into a slide-out menu on small screens.

---

## Quality checks

The following were run on this codebase:

- `npm run lint`, `tsc --noEmit` and `npm run build`: all pass.
- **Functional walkthrough against the live backend:**
  - login and logout for all three roles, including signing in again after a logout;
  - URL-synced filters and sorting;
  - doctor profile → booking → bKash sandbox redirect → callback → appointments page;
  - cancellation with confirmation;
  - schedule create (with validation), edit and delete;
  - block/unblock;
  - every dashboard page.
- **Console:** no errors on all 21 routes in light mode, and on Home, Find Doctors and Dashboard in dark mode.
- **Contrast:** WCAG AA measured for every brand text/background pair in both themes.
- **Backend API suite:** 137 of 137 checks pass (see the backend README).

Not automated:
- completing a real bKash payment (this needs the sandbox wallet in a browser);
- signing in with a real Google account.

---

## Deployment

1. Set the [environment variables](#environment-variables) for production, with `BACKEND_URL` pointing at the deployed API and `NEXT_PUBLIC_SITE_URL` at this app's domain.
2. Build and start:
   ```bash
   npm ci
   npm run build
   npm start          # listens on port 3000 by default (PORT=… to change)
   ```
3. Serve it over **HTTPS** behind a reverse proxy (e.g. Nginx). Production auth cookies are `Secure`.
4. In the backend, set `FRONTEND_URL` to this app's URL so payment redirects return here.
5. Add the production origin to the Google OAuth client's **Authorized JavaScript origins**.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Lists stay on skeletons, or API calls return 500 "Failed to proxy" | The backend isn't reachable at `BACKEND_URL`. Start it and check the port. |
| Styles don't update after editing `globals.css` in dev | Turbopack occasionally keeps a stale CSS build. Restart `npm run dev`. |
| Google button missing | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is empty or invalid (it must end in `.apps.googleusercontent.com`). Restart dev after changing env files. |
| Google popup says origin not allowed | Add this app's exact origin under **Authorized JavaScript origins** in Google Cloud Console. |
| AI assistant replies "temporarily unavailable" | The backend's OpenRouter limit was reached (free models allow 50 requests/day). Add credits or switch models in the backend. |
| After bKash you land on an error status | The backend's `BKASH_CALLBACK_URL` must be publicly reachable and `FRONTEND_URL` must match this app. |
| Animations don't play in a background browser tab | Expected: browsers pause animation frames in hidden tabs, and React reveals streamed content on the next frame. |

---

## Requirements checklist

How this app maps to the project's upgrade instructions:

| Requirement | Where |
|---|---|
| ≤ 3 brand colours + neutral, light & dark mode, AA contrast | `globals.css` tokens, [Design system](#design-system) |
| Unified radius, 8px grid, consistent type scale | `--radius`, `.container-page`, `.section`, display/sans/mono roles |
| Reusable Button, Input, Card, Badge, Modal, Table, Dropdown | `components/ui/*` |
| Fully responsive, hamburger menu, no overflow | `Navbar` sheet menu, tested 375/768/1280px |
| Forms with validation, errors, success, loading, labels | Login, Register, Contact, Create/Edit schedule, Create admin, Profile |
| Sticky navbar, 4+ routes logged out, 6+ logged in, advanced dropdown | Floating glass navbar, profile dropdown (`UserMenu`) |
| Hero 60–70vh with interactive element | Rotating word, live stats count-up, AI question box |
| 8+ meaningful sections with real data | Home: 9 sections, live doctors and stats from the API |
| Functional footer with contact and social links | `Footer.tsx` (update values in `config/site.ts`) |
| Cards: image, title, description, meta, "View details"; 4 per row; skeletons | `DoctorCard.tsx` |
| Public details page with overview, key info, related items | `/doctors/[doctorId]` |
| Listing with search, 2+ filters, sorting, pagination | `/doctors` |
| JWT auth, protected routes, roles, demo login, Google login | `proxy.ts`, `RequireUser`, `LoginForm`, `GoogleSignInButton` |
| Role dashboards: sidebar items, overview cards, bar/line/pie charts, tables | `/dashboard/*` |
| Profile: edit info, photo upload, password update | `/dashboard/profile` |
| 3+ additional pages incl. working contact form stored in DB | About, Contact, FAQ, Privacy, Terms |
| Lazy loading, code splitting, image optimisation, no console logs | Route-level splitting, `next/image`, Biome lint |
