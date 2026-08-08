import { ApiResponse, fetcher } from "@/lib/api";

export function logoutUser() {
  return fetcher<ApiResponse<null>>("/logout", {
    method: "POST",
  });
}
