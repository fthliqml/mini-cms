export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function fetcher<T>(
  endpoint: string,
  options: RequestInit = {}
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `HTTP Error ${response.status}`);
  }

  return data as T;
}
