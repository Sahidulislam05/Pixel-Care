import Image from "next/image";
import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

// Three calm tints from the brand palette, picked deterministically per doctor.
const TINTS = [
  "from-accent to-secondary text-accent-foreground",
  "from-secondary to-accent text-secondary-foreground",
  "from-highlight-soft to-accent text-highlight",
];

const tintFor = (seed: string) =>
  TINTS[
    [...seed].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % TINTS.length
  ];

type DoctorAvatarProps = {
  name: string;
  imageUrl?: string | null;
  className?: string;
  textClassName?: string;
  sizes?: string;
  priority?: boolean;
};

/** Doctor photo, or an initials monogram on a soft brand gradient when none was uploaded. */
export function DoctorAvatar({
  name,
  imageUrl,
  className,
  textClassName,
  sizes = "300px",
  priority,
}: DoctorAvatarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-linear-to-br",
        tintFor(name),
        className,
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`Photo of ${name}`}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      ) : (
        <span
          role="img"
          aria-label={`${name} monogram`}
          className={cn(
            "absolute inset-0 flex items-center justify-center font-display text-6xl italic",
            textClassName,
          )}
        >
          {initials(name)}
        </span>
      )}
    </div>
  );
}
