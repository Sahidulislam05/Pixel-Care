const takaFormatter = new Intl.NumberFormat("en-BD", {
  maximumFractionDigits: 0,
});

export const formatTaka = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === ""
    ? "—"
    : `৳${takaFormatter.format(Number(value))}`;

export const formatDate = (value: string | Date | null | undefined) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const formatTime = (value: string | Date | null | undefined) =>
  value
    ? new Date(value).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

export const formatDateTime = (value: string | Date | null | undefined) =>
  value ? `${formatDate(value)}, ${formatTime(value)}` : "—";

export const formatMonth = (yyyyMm: string) => {
  const [year, month] = yyyyMm.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
  });
};

export const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

export const titleCase = (value: string) =>
  value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ");

/** "Mirpur 10, Dhaka" -> "Dhaka" */
export const cityOf = (address: string | null | undefined) =>
  address ? (address.split(",").at(-1)?.trim() ?? address) : null;
