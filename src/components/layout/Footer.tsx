import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";
import { EcgLine } from "@/components/shared/EcgLine";
import { footerLinks, siteConfig } from "@/config/site";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}
function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  );
}
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

const socials = [
  { href: siteConfig.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: siteConfig.social.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
  { href: siteConfig.social.github, label: "GitHub", Icon: GithubIcon },
];

export function Footer() {
  const { contact } = siteConfig;
  return (
    <footer className="relative mt-auto overflow-hidden border-t bg-card">
      <EcgLine className="absolute inset-x-0 -top-12 h-24 opacity-60" />
      <div className="container-page grid gap-10 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <Logo />
          <p className="font-display max-w-sm text-3xl leading-tight">
            Care that comes to you,{" "}
            <em className="text-highlight">wherever you are.</em>
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 text-primary" />
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-foreground"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 text-primary" />
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-foreground"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-primary" /> {contact.address}
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="size-4 text-primary" /> {contact.hours}
            </li>
          </ul>
        </div>

        {Object.entries(footerLinks).map(([group, links]) => (
          <nav key={group} aria-label={group}>
            <h2 className="mb-4 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {group}
            </h2>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          <ul className="flex items-center gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Oversized wordmark as a quiet sign-off. */}
      <p
        aria-hidden="true"
        className="font-display pointer-events-none -mb-[0.22em] text-center text-[22vw] leading-none text-foreground/[0.045] select-none"
      >
        Pixel Care
      </p>
    </footer>
  );
}
