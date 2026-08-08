export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type ValidationErrors = Record<string, string[]>;

interface ApiErrorPayload {
  message?: string;
  error?: string;
  errors?: ValidationErrors;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly errors?: ValidationErrors,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function getApiErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const xsrfToken = getCsrfToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(xsrfToken && { "X-XSRF-TOKEN": xsrfToken }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => null)) as
    | ApiErrorPayload
    | T
    | null;

  if (!response.ok) {
    const error = data as ApiErrorPayload | null;

    throw new ApiError(
      error?.message || error?.error || `HTTP Error ${response.status}`,
      response.status,
      error?.errors,
    );
  }

  return data as T;
}
