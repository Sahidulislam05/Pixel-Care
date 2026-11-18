import {
  ActivityIcon,
  BabyIcon,
  BoneIcon,
  BrainIcon,
  DropletIcon,
  EarIcon,
  EyeIcon,
  HeartPulseIcon,
  type LucideIcon,
  MicroscopeIcon,
  PillIcon,
  SmileIcon,
  SparklesIcon,
  StethoscopeIcon,
  SyringeIcon,
  WindIcon,
} from "lucide-react";
import Link from "next/link";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { Marquee } from "@/components/shared/Marquee";
import { SectionHeading } from "@/components/shared/SectionHeading";

type Specialty = { name: string; icon: LucideIcon };

const ROW_ONE: Specialty[] = [
  { name: "Cardiology", icon: HeartPulseIcon },
  { name: "Pediatrics", icon: BabyIcon },
  { name: "Dermatology", icon: SparklesIcon },
  { name: "Neurology", icon: BrainIcon },
  { name: "Orthopedics", icon: BoneIcon },
  { name: "Gynecology", icon: ActivityIcon },
  { name: "Psychiatry", icon: SmileIcon },
  { name: "Internal Medicine", icon: StethoscopeIcon },
];
const ROW_TWO: Specialty[] = [
  { name: "ENT", icon: EarIcon },
  { name: "Ophthalmology", icon: EyeIcon },
  { name: "Pulmonology", icon: WindIcon },
  { name: "Endocrinology", icon: PillIcon },
  { name: "Hematology", icon: DropletIcon },
  { name: "Oncology", icon: MicroscopeIcon },
  { name: "Infectious Disease", icon: SyringeIcon },
  { name: "Gastroenterology", icon: ActivityIcon },
];

function SpecialtyChip({ name, icon: Icon }: Specialty) {
  return (
    <Link
      href={`/doctors?specialization=${encodeURIComponent(name)}`}
      className="group flex shrink-0 items-center gap-3 rounded-xl border bg-card px-5 py-3.5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground"
    >
      <Icon className="size-5 text-primary transition-colors group-hover:text-primary-foreground" />
      <span className="font-display text-2xl whitespace-nowrap">{name}</span>
    </Link>
  );
}

export function Specializations() {
  return (
    <section
      className="section overflow-hidden"
      aria-labelledby="specializations-heading"
    >
      <div className="container-page">
        <SectionHeading
          id="specializations-heading"
          index="01"
          eyebrow="Specialities"
          title={
            <>
              Care for <em>every</em> part of you
            </>
          }
          description="34 specialities, from everyday worries to complex conditions. Tap one to see who can help."
          action={<ArrowLink href="/doctors">All specialities</ArrowLink>}
        />
      </div>
      <div className="reveal space-y-3">
        <Marquee label="Popular specialities" durationSeconds={45}>
          {ROW_ONE.map((item) => (
            <SpecialtyChip key={item.name} {...item} />
          ))}
        </Marquee>
        <Marquee label="More specialities" durationSeconds={50} reverse>
          {ROW_TWO.map((item) => (
            <SpecialtyChip key={item.name} {...item} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
