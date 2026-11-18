import type { ApiResponse, Meta } from "@/types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type QueryValue = string | number | boolean | undefined | null;

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Internal: set once a token refresh has been tried for this request. */
  isRetry?: boolean;
};

export const buildQuery = (query?: Record<string, QueryValue>) => {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const text = params.toString();
  return text ? `?${text}` : "";
};

// One in-flight refresh shared by every request that hits a 401 at once.
let refreshPromise: Promise<boolean> | null = null;

const refreshSession = () => {
  refreshPromise ??= fetch("/api/v1/auth/refresh-token", {
    method: "POST",
    credentials: "include",
  })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

/**
 * Browser-side API call. Talks to /api/v1 on this origin (rewritten to the
 * Express API), sends auth cookies, and transparently refreshes an expired
 * access token once.
 */
export async function api<T>(
  path: string,
  { method = "GET", body, query, isRetry }: RequestOptions = {},
): Promise<{ data: T; meta?: Meta; message: string }> {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`/api/v1${path}${buildQuery(query)}`, {
    method,
    credentials: "include",
    headers:
      body && !isFormData ? { "Content-Type": "application/json" } : undefined,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
  });

  const isAuthRoute =
    path.startsWith("/auth/login") || path.startsWith("/auth/refresh");
  if (
    res.status === 401 &&
    !isRetry &&
    !isAuthRoute &&
    (await refreshSession())
  ) {
    return api<T>(path, { method, body, query, isRetry: true });
  }

  let json: ApiResponse<T> | null = null;
  try {
    json = await res.json();
  } catch {
    // Non-JSON (e.g. gateway error page).
  }

  if (!res.ok || !json?.success) {
    throw new ApiError(
      json?.message || "Something went wrong. Please try again.",
      res.status,
    );
  }

  return { data: json.data, meta: json.meta, message: json.message };
}

export const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
