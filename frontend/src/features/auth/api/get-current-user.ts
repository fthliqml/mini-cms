import { ApiResponse, fetcher } from "@/lib/api";
import type { AuthUser } from "../types/auth";

export function getCurrentUser() {
  return fetcher<ApiResponse<AuthUser>>("/me");
}
