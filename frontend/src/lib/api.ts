export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }

  return res.json();
}
