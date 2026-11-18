"use client";

import { SearchIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FilterSelect, type Option } from "@/components/shared/FilterSelect";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState, ErrorState } from "@/components/shared/States";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SPECIALIZATIONS } from "@/config/site";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useUrlState } from "@/hooks/useUrlState";
import { cn } from "@/lib/utils";
import type { DoctorListQuery } from "../api";
import { useAvailableToday, useDoctors } from "../hooks";
import { DOCTOR_GRID, DoctorCard, DoctorCardSkeleton } from "./DoctorCard";

const PAGE_SIZE = 12;

const specializationOptions: Option[] = [
  { value: "all", label: "All specializations" },
  ...SPECIALIZATIONS.map((s) => ({ value: s, label: s })),
];

const FEE_RANGES: Record<
  string,
  { label: string; minFee?: number; maxFee?: number }
> = {
  all: { label: "Any fee" },
  "0-800": { label: "Up to ৳800", maxFee: 800 },
  "800-1200": { label: "৳800 – ৳1,200", minFee: 800, maxFee: 1200 },
  "1200-1600": { label: "৳1,200 – ৳1,600", minFee: 1200, maxFee: 1600 },
  "1600+": { label: "৳1,600 and above", minFee: 1600 },
};
const feeOptions: Option[] = Object.entries(FEE_RANGES).map(
  ([value, { label }]) => ({ value, label }),
);

const experienceOptions: Option[] = [
  { value: "all", label: "Any experience" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
  { value: "15", label: "15+ years" },
  { value: "20", label: "20+ years" },
];

const SORTS: Record<
  string,
  { label: string; sortBy: string; sortOrder: "asc" | "desc" }
> = {
  experience: {
    label: "Most experienced",
    sortBy: "experienceYears",
    sortOrder: "desc",
  },
  "fee-asc": {
    label: "Fee: low to high",
    sortBy: "consultationFee",
    sortOrder: "asc",
  },
  "fee-desc": {
    label: "Fee: high to low",
    sortBy: "consultationFee",
    sortOrder: "desc",
  },
  name: { label: "Name: A to Z", sortBy: "name", sortOrder: "asc" },
  newest: {
    label: "Newest on Pixel-Care",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};
const sortOptions: Option[] = Object.entries(SORTS).map(
  ([value, { label }]) => ({ value, label }),
);

export function DoctorExplorer() {
  const { get, set } = useUrlState();

  const specialization = get("specialization", "all");
  const fee = get("fee", "all");
  const experience = get("experience", "all");
  const sort = get("sort", "experience");
  const isAvailableToday = get("available") === "today";
  const page = Number(get("page", "1")) || 1;

  // Search box is local state, pushed to the URL after typing pauses.
  const [search, setSearch] = useState(get("q"));
  const debouncedSearch = useDebouncedValue(search.trim());
  useEffect(() => {
    if (debouncedSearch !== get("q")) set({ q: debouncedSearch });
  }, [debouncedSearch, get, set]);

  const feeRange = FEE_RANGES[fee] ?? FEE_RANGES.all;
  const sortConfig = SORTS[sort] ?? SORTS.experience;
  const query: DoctorListQuery = {
    page,
    limit: PAGE_SIZE,
    searchTerm: get("q") || undefined,
    specialization: specialization === "all" ? undefined : specialization,
    ...(isAvailableToday
      ? {}
      : {
          minFee: feeRange.minFee,
          maxFee: feeRange.maxFee,
          minExperience: experience === "all" ? undefined : Number(experience),
        }),
    sortBy: sortConfig.sortBy,
    sortOrder: sortConfig.sortOrder,
  };

  const allDoctors = useDoctors(query);
  const todayDoctors = useAvailableToday(query, isAvailableToday);
  const result = isAvailableToday ? todayDoctors : allDoctors;
  const doctors = result.data?.data ?? [];

  const hasFilters =
    Boolean(get("q")) ||
    specialization !== "all" ||
    fee !== "all" ||
    experience !== "all" ||
    isAvailableToday;

  const clearAll = () => {
    setSearch("");
    set({
      q: null,
      specialization: null,
      fee: null,
      experience: null,
      available: null,
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-card p-4 shadow-xs sm:p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          <div className="grid gap-1.5 lg:col-span-4">
            <Label
              htmlFor="doctor-search"
              className="text-xs text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="doctor-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Doctor name, specialty or qualification"
                className="h-10 pl-9"
              />
            </div>
          </div>
          <FilterSelect
            id="filter-specialization"
            label="Specialization"
            value={specialization}
            options={specializationOptions}
            onChange={(v) => set({ specialization: v })}
            className="lg:col-span-2"
          />
          <FilterSelect
            id="filter-fee"
            label="Consultation fee"
            value={fee}
            options={feeOptions}
            onChange={(v) => set({ fee: v })}
            disabled={isAvailableToday}
            className="lg:col-span-2"
          />
          <FilterSelect
            id="filter-experience"
            label="Experience"
            value={experience}
            options={experienceOptions}
            onChange={(v) => set({ experience: v })}
            disabled={isAvailableToday}
            className="lg:col-span-2"
          />
          <FilterSelect
            id="sort"
            label="Sort by"
            value={sort}
            options={sortOptions}
            onChange={(v) => set({ sort: v === "experience" ? null : v })}
            className="lg:col-span-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <button
            type="button"
            role="switch"
            aria-checked={isAvailableToday}
            onClick={() =>
              set({ available: isAvailableToday ? null : "today" })
            }
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
              isAvailableToday
                ? "border-secondary-foreground/30 bg-secondary text-secondary-foreground"
                : "hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "size-2 rounded-full",
                isAvailableToday
                  ? "animate-pulse bg-current"
                  : "bg-muted-foreground/40",
              )}
              aria-hidden="true"
            />
            Available today only
          </button>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
            <span aria-live="polite">
              {result.data?.meta
                ? `${result.data.meta.total} doctors found`
                : "Searching…"}
            </span>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <XIcon /> Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {result.isError ? (
        <ErrorState
          message={result.error.message}
          onRetry={() => result.refetch()}
        />
      ) : result.isLoading ? (
        <div className={DOCTOR_GRID}>
          {Array.from({ length: 8 }, (_, i) => (
            <DoctorCardSkeleton key={i} />
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          title="No doctors match these filters"
          description={
            isAvailableToday
              ? "No matching doctor has an open slot left today. Try all doctors instead."
              : "Try a different specialization or widen the fee and experience range."
          }
          action={
            <Button variant="outline" onClick={clearAll}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div
          className={cn(
            DOCTOR_GRID,
            result.isFetching && "opacity-70 transition-opacity",
          )}
        >
          {doctors.map((doctor, i) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              priority={i < 4}
              availableSlots={
                isAvailableToday && "schedules" in doctor
                  ? (
                      doctor as { schedules: { availableSlots: number }[] }
                    ).schedules.reduce((sum, s) => sum + s.availableSlots, 0)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <Pagination
        meta={result.data?.meta}
        onPageChange={(next) => {
          set({ page: next });
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        label="doctors"
      />
    </div>
  );
}
