import { API_URL, ApiResponse, fetcher } from "@/lib/api";
import type { LoginFormValues } from "../schemas/login-schema";
import type { AuthUser } from "../types/auth";

async function getCsrfCookie() {
  const baseUrl = API_URL.replace(/\/api\/?$/, "");

  await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });
}

export async function loginUser(payload: LoginFormValues) {
  try {
    await getCsrfCookie();
  } catch {
    // Let the login request return the actionable authentication error.
  }

  return fetcher<ApiResponse<AuthUser>>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
