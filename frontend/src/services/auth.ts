import { ApiResponse, fetcher, API_URL } from "@/lib/api";
import { Author } from "@/lib/constants";
import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export async function getCsrfCookie() {
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
    // Fallback if csrf-cookie request fails or is not enabled
  }

  return fetcher<ApiResponse<Author>>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
