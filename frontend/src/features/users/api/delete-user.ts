import { ApiResponse, fetcher } from "@/lib/api";

export async function deleteUser(id: number) {
  await fetcher<ApiResponse<null>>(`/users/${id}`, {
    method: "DELETE",
  });
}
