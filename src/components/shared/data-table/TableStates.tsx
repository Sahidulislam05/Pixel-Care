import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TableSkeletonRows({
  columns,
  rows = 5,
}: {
  columns: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }, (_, r) => (
        <TableRow key={r}>
          {Array.from({ length: columns }, (_, c) => (
            <TableCell key={c}>
              <Skeleton className="h-5 w-full max-w-40" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function TableEmptyRow({
  columns,
  message,
}: {
  columns: number;
  message: string;
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={columns}
        className="h-32 text-center text-muted-foreground"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
