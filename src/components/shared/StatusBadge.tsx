import { Badge } from "@/components/ui/badge";
import { titleCase } from "@/lib/format";

type Variant =
  | "default"
  | "secondary"
  | "success"
  | "highlight"
  | "destructive"
  | "outline";

// Colour = meaning: mint for good/done, teal for in progress, coral for "needs
// attention", red only for failures, neutral outline for closed states.
const STATUS_VARIANT: Record<string, Variant> = {
  // appointment
  PENDING: "highlight",
  CONFIRMED: "default",
  ONGOING: "secondary",
  COMPLETED: "success",
  CANCELLED: "outline",
  // payment
  UNPAID: "highlight",
  PAID: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
  // schedule
  DRAFT: "outline",
  PUBLISHED: "success",
  // doctor application / user
  APPROVED: "success",
  REJECTED: "destructive",
  ACTIVE: "success",
  BLOCKED: "destructive",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANT[status] ?? "outline"}>
      {titleCase(status)}
    </Badge>
  );
}
