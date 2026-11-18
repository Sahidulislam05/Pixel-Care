import { cn } from "@/lib/utils";

// One heartbeat: flat, P wave, sharp QRS spike, T wave, flat. Drawn once on load,
// then a short bright pulse keeps travelling along it.
const PATH =
  "M0 60 H260 Q275 60 282 48 Q290 36 298 60 H330 L345 72 L362 6 L380 104 L394 60 H430 Q450 60 462 38 Q476 18 490 60 H760 Q775 60 782 48 Q790 36 798 60 H830 L845 72 L862 6 L880 104 L894 60 H930 Q950 60 962 38 Q976 18 990 60 H1200";

export function EcgLine({
  className,
  strokeClassName = "stroke-primary",
}: {
  className?: string;
  strokeClassName?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 110"
      preserveAspectRatio="none"
      className={cn("h-24 w-full", className)}
      aria-hidden="true"
      fill="none"
    >
      <path
        d={PATH}
        className={cn("ecg-line opacity-40", strokeClassName)}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={PATH}
        className="ecg-pulse stroke-highlight"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
