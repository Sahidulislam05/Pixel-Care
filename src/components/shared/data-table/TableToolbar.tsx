import type { ReactNode } from "react";

/** Wraps filters above a table and the table card itself. */
export function TableCard({
  toolbar,
  children,
  footer,
}: {
  toolbar?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {toolbar && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          {toolbar}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
        <div className="overflow-x-auto">{children}</div>
      </div>
      {footer}
    </div>
  );
}
