"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMonth, formatTaka, titleCase } from "@/lib/format";
import type { ChartData } from "@/types/api";

// Colours come from CSS tokens so charts follow light/dark mode automatically.
const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: "var(--chart-1)",
  COMPLETED: "var(--chart-2)",
  PENDING: "var(--chart-3)",
  ONGOING: "var(--chart-5)",
  CANCELLED: "var(--chart-4)",
};

const axisProps = {
  stroke: "var(--muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
} as const;

const tooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--popover-foreground)",
    fontSize: 13,
  },
  cursor: { fill: "var(--muted)", opacity: 0.6 },
};

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-xs">
      <h2 className="font-display text-2xl">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-4 h-64">{children}</div>
    </section>
  );
}

export function AppointmentsBarChart({
  data,
}: {
  data: ChartData["monthlyTrend"];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -20, right: 8 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis dataKey="month" tickFormatter={formatMonth} {...axisProps} />
        <YAxis allowDecimals={false} {...axisProps} />
        <Tooltip
          {...tooltipStyle}
          labelFormatter={(m) => formatMonth(String(m))}
        />
        <Bar
          dataKey="appointments"
          name="Appointments"
          fill="var(--chart-1)"
          radius={[6, 6, 0, 0]}
          maxBarSize={44}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenueLineChart({
  data,
  label = "Revenue",
}: {
  data: ChartData["monthlyTrend"];
  label?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: 0, right: 12 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis dataKey="month" tickFormatter={formatMonth} {...axisProps} />
        <YAxis
          tickFormatter={(v) =>
            `৳${Number(v) >= 1000 ? `${Math.round(Number(v) / 1000)}k` : v}`
          }
          {...axisProps}
        />
        <Tooltip
          {...tooltipStyle}
          cursor={{ stroke: "var(--border)" }}
          labelFormatter={(m) => formatMonth(String(m))}
          formatter={(value) => [formatTaka(Number(value)), label]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          name={label}
          stroke="var(--chart-2)"
          strokeWidth={3}
          dot={{ r: 4, fill: "var(--chart-2)" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({
  data,
}: {
  data: ChartData["appointmentsByStatus"];
}) {
  const slices = data.filter((item) => item.count > 0);
  if (slices.length === 0) {
    return (
      <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No appointments yet
      </p>
    );
  }
  return (
    <div className="flex h-full items-center gap-4">
      <ResponsiveContainer width="60%" height="100%">
        <PieChart>
          <Pie
            data={slices}
            dataKey="count"
            nameKey="status"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={3}
            stroke="var(--card)"
          >
            {slices.map((slice) => (
              <Cell key={slice.status} fill={STATUS_COLOR[slice.status]} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(value, name) => [value, titleCase(String(name))]}
          />
        </PieChart>
      </ResponsiveContainer>
      <ul className="flex-1 space-y-2 text-sm">
        {slices.map((slice) => (
          <li key={slice.status} className="flex items-center gap-2">
            <span
              className="size-3 rounded-sm"
              style={{ background: STATUS_COLOR[slice.status] }}
              aria-hidden="true"
            />
            <span className="flex-1 text-muted-foreground">
              {titleCase(slice.status)}
            </span>
            <span className="font-semibold tabular-nums">{slice.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
