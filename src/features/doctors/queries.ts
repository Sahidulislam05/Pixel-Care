import { cacheLife, cacheTag } from "next/cache";
import { getBackendUrl } from "@/config/env";
import type { ApiResponse, Doctor } from "@/types/api";

// Server-side reads for public doctor pages (SEO). Cached for a few minutes so
// repeat visits don't hit the API; profiles change rarely.

export async function getPublicDoctor(
  doctorId: string,
): Promise<Doctor | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag(`doctor:${doctorId}`);

  const res = await fetch(
    `${getBackendUrl()}/api/v1/doctor/public/${encodeURIComponent(doctorId)}`,
  );
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Failed to load doctor (${res.status})`);
  const json = (await res.json()) as ApiResponse<Doctor>;
  return json.data;
}

export async function getRelatedDoctors(
  specialization: string,
  excludeId: string,
): Promise<Doctor[]> {
  "use cache";
  cacheLife("minutes");

  const params = new URLSearchParams({
    specialization,
    limit: "5",
    sortBy: "experienceYears",
    sortOrder: "desc",
  });
  const res = await fetch(
    `${getBackendUrl()}/api/v1/doctor/public/all-doctors?${params}`,
  );
  if (!res.ok) return [];
  const json = (await res.json()) as ApiResponse<Doctor[]>;
  return json.data.filter((doctor) => doctor.id !== excludeId).slice(0, 4);
}
