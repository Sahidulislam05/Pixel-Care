import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TONES = {
  primary: "bg-accent text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  highlight: "bg-highlight-soft text-highlight",
  neutral: "bg-muted text-muted-foreground",
} as const;

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: keyof typeof TONES;
  hint?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  hint,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-foreground/5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg transition-transform duration-500 group-hover:rotate-12",
            TONES[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 font-mono text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className="h-28" />
      ))}
    </div>
  );
}
