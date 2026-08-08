import { ApiResponse, fetcher } from "@/lib/api";
import type { ManagedUser, UpdateUserInput } from "../types/user";

export async function updateUser(id: number, input: UpdateUserInput) {
  const response = await fetcher<ApiResponse<ManagedUser>>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

  return response.data;
}
