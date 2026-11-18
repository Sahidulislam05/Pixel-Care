import { PlusIcon } from "lucide-react";

type FaqListProps = { items: readonly { q: string; a: string }[] };

/** Accessible accordion using native <details>: keyboard and screen-reader friendly, no JS. */
export function FaqList({ items }: FaqListProps) {
  return (
    <div className="reveal border-t">
      {items.map((item, i) => (
        <details
          key={item.q}
          className="group border-b [&_summary::-webkit-details-marker]:hidden"
          open={i === 0}
        >
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 transition-colors hover:text-primary">
            <span className="flex gap-4">
              <span className="pt-1.5 font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl leading-snug sm:text-3xl">
                {item.q}
              </span>
            </span>
            <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 group-open:rotate-45 group-open:bg-foreground group-open:text-background">
              <PlusIcon className="size-4" />
            </span>
          </summary>
          <p className="max-w-2xl pb-6 pl-8 leading-relaxed text-muted-foreground">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}
