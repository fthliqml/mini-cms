import { ApiResponse, fetcher } from "@/lib/api";
import type { CreateUserInput, ManagedUser } from "../types/user";

export async function createUser(input: CreateUserInput) {
  const response = await fetcher<ApiResponse<ManagedUser>>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  });

  return response.data;
}
